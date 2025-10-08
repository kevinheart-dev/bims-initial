<?php

namespace App\Exports;

use App\Models\Vehicle;
use App\Models\Resident;
use App\Models\Barangay;
use App\Models\BarangayOfficial;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;

class VehicleExport implements FromCollection, WithHeadings, ShouldAutoSize, WithEvents
{
    protected $barangay;
    protected $totalRecords;

    public function __construct()
    {
        $this->barangay = Barangay::find(auth()->user()->barangay_id);
    }

    public function collection()
    {
        $brgy_id = auth()->user()->barangay_id;

        // Vehicle filter closure
        $vehicleFilter = function ($q) {
            if (request()->filled('v_type') && request('v_type') !== 'All') {
                $q->where('vehicle_type', request('v_type'));
            }
            if (request()->filled('v_class') && request('v_class') !== 'All') {
                $q->where('vehicle_class', request('v_class'));
            }
            if (request()->filled('usage') && request('usage') !== 'All') {
                $q->where('usage_status', request('usage'));
            }
        };

        $residents = Resident::where('barangay_id', $brgy_id)
            ->whereHas('vehicles', $vehicleFilter)
            ->with(['vehicles' => $vehicleFilter])
            ->when(request()->filled('purok') && request('purok') !== 'All', fn($q) => $q->where('purok_number', request('purok')))
            ->when(request('name'), function ($q) {
                $name = request('name');
                $q->whereRaw(
                    "CONCAT(firstname, ' ', middlename, ' ', lastname, ' ', COALESCE(suffix,'')) LIKE ?",
                    ["%{$name}%"]
                );
            })
            ->select('id', 'firstname', 'middlename', 'lastname', 'suffix', 'purok_number')
            ->get();

        $vehicles = $residents->flatMap(function ($resident) {
            $fullName = trim("{$resident->firstname} {$resident->middlename} {$resident->lastname} {$resident->suffix}");
            return $resident->vehicles->map(function ($vehicle) use ($resident, $fullName) {
                return [
                    'Resident ID'   => $resident->id,
                    'Full Name'     => $fullName,
                    'Purok'         => $resident->purok_number,
                    'Vehicle Type'  => $vehicle->vehicle_type,
                    'Vehicle Class' => $vehicle->vehicle_class,
                    'Usage Status'  => $vehicle->usage_status,
                ];
            });
        });

        $this->totalRecords = $vehicles->count();
        return $vehicles;
    }

    public function headings(): array
    {
        return [
            'Resident ID', 'Full Name', 'Purok', 'Vehicle Type', 'Vehicle Class', 'Usage Status'
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();
                $lastColumn = $sheet->getHighestColumn();
                $lastColumnIndex = Coordinate::columnIndexFromString($lastColumn);

                // Insert 4 rows for title + total
                $sheet->insertNewRowBefore(1, 4);

                // === Get logos dynamically and safely ===
                $barangayLogoPath = $this->barangay->logo_path
                    ? storage_path('app/public/' . ltrim($this->barangay->logo_path, '/'))
                    : public_path('images/csa-logo.png');

                $cityLogoPath = public_path('images/city-of-ilagan.png');

                // ✅ Check existence of Barangay logo, fallback if missing
                if (!file_exists($barangayLogoPath)) {
                    // Log warning (optional for debugging)
                    \Log::warning("Barangay logo not found at: {$barangayLogoPath}");

                    // Use fallback logo
                    $barangayLogoPath = public_path('images/csa-logo.png');
                }

                // ✅ Check existence of City logo, fallback if missing
                if (!file_exists($cityLogoPath)) {
                    \Log::warning("City logo not found at: {$cityLogoPath}");
                    $cityLogoPath = public_path('images/default-logo.png'); // optional fallback
                }

                // ✅ Assign safely to variables used in PDF
                $barangayLogo = $barangayLogoPath;
                $cityLogo = $cityLogoPath;

                // Adjusted row heights for logos + titles
                $sheet->getRowDimension(1)->setRowHeight(60); // space for logos
                $sheet->getRowDimension(2)->setRowHeight(20);
                $sheet->getRowDimension(3)->setRowHeight(20);
                $sheet->getRowDimension(4)->setRowHeight(20);

                // === Logos ===
                $logoLeft = new Drawing();
                $logoLeft->setPath($barangayLogo);
                $logoLeft->setHeight(80);
                $logoLeft->setCoordinates('A1'); // top-left
                $logoLeft->setOffsetX(5); // small padding from cell edge
                $logoLeft->setOffsetY(5); // small padding from top
                $logoLeft->setWorksheet($sheet);

                $logoRight = new Drawing();
                $logoRight->setPath($cityLogo);
                $logoRight->setHeight(80);
                $logoRight->setCoordinates($lastColumn . '1'); // top-right
                $logoRight->setOffsetX(-5); // pull slightly left from cell edge
                $logoRight->setOffsetY(5);  // small padding from top
                $logoRight->setWorksheet($sheet);

                // Make sure header row is further down
                $headerRow = 5; // keep as is
                $sheet->getRowDimension($headerRow)->setRowHeight(20);

                // === Titles ===
                $sheet->setCellValue('A1', 'VEHICLE LIST ' . now()->year);
                $sheet->setCellValue('A2', 'Barangay: ' . $this->barangay->barangay_name);
                $sheet->setCellValue('A3', 'Region II, Isabela, ' . $this->barangay->city);

                // Merge title rows across all columns
                $sheet->mergeCells("A1:{$lastColumn}1");
                $sheet->mergeCells("A2:{$lastColumn}2");
                $sheet->mergeCells("A3:{$lastColumn}3");

                // Style main title
                $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(16);
                $sheet->getStyle('A1')->getAlignment()->setHorizontal('center')->setVertical('center');

                // Style subtitle rows
                $sheet->getStyle('A2:A3')->getFont()->setBold(true)->setSize(12);
                $sheet->getStyle('A2:A3')->getAlignment()->setHorizontal('center')->setVertical('center');

                // Total records row
                $sheet->setCellValue('A4', "Total Records: {$this->totalRecords}");
                $sheet->mergeCells("A4:{$lastColumn}4"); // Merge across all columns
                $sheet->getStyle('A4')->getFont()->setBold(true)->setItalic(true)->setSize(12);
                $sheet->getStyle('A4')->getAlignment()->setHorizontal('left')->setVertical('center');

                // === Header row styling ===
                $headerRow = 5;
                $sheet->getStyle("A{$headerRow}:{$lastColumn}{$headerRow}")->applyFromArray([
                    'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                    'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '1a66ff']],
                    'alignment' => ['horizontal' => 'center', 'vertical' => 'center'],
                    'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]],
                ]);

                // Borders for data rows
                $lastRow = $sheet->getHighestRow();
                if ($lastRow > $headerRow) {
                    $sheet->getStyle("A" . ($headerRow + 1) . ":{$lastColumn}{$lastRow}")
                        ->getBorders()
                        ->getAllBorders()
                        ->setBorderStyle(Border::BORDER_THIN);
                }

                // === Signatories ===
                $officials = BarangayOfficial::with('resident')
                    ->whereHas('resident', fn($q) => $q->where('barangay_id', $this->barangay->id))
                    ->get();
                $captain = $officials->firstWhere('position', 'barangay_captain')?->resident?->fullname ?? 'N/A';
                $secretary = $officials->firstWhere('position', 'barangay_secretary')?->resident?->fullname ?? 'N/A';

                $signatureStartRow = $lastRow + 3;
                $halfColumn = floor(($lastColumnIndex + 1) / 2);

                $sheet->mergeCells("A{$signatureStartRow}:" . Coordinate::stringFromColumnIndex($halfColumn) . $signatureStartRow);
                $sheet->setCellValue("A{$signatureStartRow}", "______________________________");
                $sheet->mergeCells("A" . ($signatureStartRow + 1) . ":" . Coordinate::stringFromColumnIndex($halfColumn) . ($signatureStartRow + 1));
                $sheet->setCellValue("A" . ($signatureStartRow + 1), "Hon. " . $captain);
                $sheet->getStyle("A{$signatureStartRow}:" . Coordinate::stringFromColumnIndex($halfColumn) . ($signatureStartRow + 1))
                    ->getAlignment()->setHorizontal('center');

                $sheet->mergeCells(Coordinate::stringFromColumnIndex($halfColumn + 1) . "{$signatureStartRow}:{$lastColumn}{$signatureStartRow}");
                $sheet->setCellValue(Coordinate::stringFromColumnIndex($halfColumn + 1) . "{$signatureStartRow}", "______________________________");
                $sheet->mergeCells(Coordinate::stringFromColumnIndex($halfColumn + 1) . ($signatureStartRow + 1) . ":{$lastColumn}" . ($signatureStartRow + 1));
                $sheet->setCellValue(Coordinate::stringFromColumnIndex($halfColumn + 1) . ($signatureStartRow + 1), "Hon. " . $secretary);
                $sheet->getStyle(Coordinate::stringFromColumnIndex($halfColumn + 1) . "{$signatureStartRow}:{$lastColumn}" . ($signatureStartRow + 1))
                    ->getAlignment()->setHorizontal('center');

                // Freeze pane
                $sheet->freezePane("A" . ($headerRow + 1));
            }
        ];
    }
}
