<?php

namespace App\Exports;

use App\Models\Barangay;
use App\Models\BarangayOfficial;
use App\Models\HouseholdResident;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;

class HouseholdExport implements FromCollection, WithHeadings, ShouldAutoSize, WithEvents
{
    protected $barangay;
    protected $totalRecords;

    public function __construct()
    {
        $this->barangay = Barangay::find(auth()->user()->barangay_id);
    }

    public function collection()
    {
        $brgy_id = Auth()->user()->barangay_id;

        $query = HouseholdResident::query()
            ->with([
                'resident:id,firstname,lastname,middlename,suffix,gender,birthdate',
                'household:id,barangay_id,purok_id,street_id,house_number,ownership_type,housing_condition,year_established,house_structure,number_of_rooms,number_of_floors',
                'household.street:id,street_name',
                'household.purok:id,purok_number',
            ])
            ->whereHas('household', fn($q) => $q->where('barangay_id', $brgy_id))
            ->where('relationship_to_head', 'self')
            ->whereIn('id', function ($sub) {
                $sub->selectRaw('MAX(id)')
                    ->from('household_residents')
                    ->where('relationship_to_head', 'self')
                    ->groupBy('household_id');
            })
            ->with(['household' => fn($q) => $q->withCount('residents')])
            ->latest('updated_at');

        // ✅ Apply filters (same as index)

        // Head name search
        if ($name = request('name')) {
            $name = trim($name);
            $parts = collect(explode(' ', $name))
                ->filter(fn($p) => $p !== '')
                ->values();

            $query->whereHas('resident', function ($r) use ($parts, $name) {
                $r->where(function ($w) use ($parts, $name) {
                    foreach ($parts as $part) {
                        $w->orWhere('firstname', 'like', "%{$part}%")
                        ->orWhere('lastname', 'like', "%{$part}%")
                        ->orWhere('middlename', 'like', "%{$part}%")
                        ->orWhere('suffix', 'like', "%{$part}%");
                    }
                    $w->orWhereRaw("CONCAT(firstname, ' ', lastname) LIKE ?", ["%{$name}%"])
                    ->orWhereRaw("CONCAT(firstname, ' ', middlename, ' ', lastname) LIKE ?", ["%{$name}%"])
                    ->orWhereRaw("CONCAT(firstname, ' ', middlename, ' ', lastname, ' ', suffix) LIKE ?", ["%{$name}%"]);
                });
            });
        }

        // Purok filter
        if (request()->filled('purok') && request('purok') !== 'All') {
            $query->whereHas('household.purok', function ($q) {
                $q->where('purok_number', request('purok'));
            });
        }

        // Street filter
        if (request()->filled('street') && request('street') !== 'All') {
            $query->whereHas('household.street', function ($q) {
                $q->where('street_name', request('street'));
            });
        }

        // Ownership type filter
        if (request()->filled('own_type') && request('own_type') !== 'All') {
            $query->whereHas('household', function ($q) {
                $q->where('ownership_type', request('own_type'));
            });
        }

        // Housing condition filter
        if (request()->filled('condition') && request('condition') !== 'All') {
            $query->whereHas('household', function ($q) {
                $q->where('housing_condition', request('condition'));
            });
        }

        // Structure filter
        if (request()->filled('structure') && request('structure') !== 'All') {
            $query->whereHas('household', function ($q) {
                $q->where('house_structure', request('structure'));
            });
        }

        // ✅ Execute
        $heads = $query->get();

        $this->totalRecords = $heads->count();

        return $heads->map(function ($head, $index) {
            $h = $head->household;

            return [
                'No.'              => $index + 1, // ✅ row number instead of ID
                'Head of Household'=> $head->resident?->fullname ?? 'N/A',
                'House Number'     => $h->house_number ?? 'N/A',
                'Street'           => $h->street?->street_name ?? 'N/A',
                'Purok'            => $h->purok?->purok_number ?? 'N/A',
                'Ownership Type'   => ucfirst($h->ownership_type ?? 'N/A'),
                'Housing Condition'=> ucfirst($h->housing_condition ?? 'N/A'),
                'House Structure'  => ucfirst($h->house_structure ?? 'N/A'),
                'Year Established' => $h->year_established ?? 'N/A',
                'No. of Rooms'     => $h->number_of_rooms ?? 0,
                'No. of Floors'    => $h->number_of_floors ?? 0,
                'Members Count'    => $h->residents_count ?? 0,
            ];
        });
    }

    public function headings(): array
    {
        return [
            'ID',
            'Head of Household',
            'House Number',
            'Street',
            'Purok',
            'Ownership Type',
            'Housing Condition',
            'House Structure',
            'Year Established',
            'No. of Rooms',
            'No. of Floors',
            'Members Count',
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();
                $lastColumn = $sheet->getHighestColumn();

                // Insert header rows
                $sheet->insertNewRowBefore(1, 4);

                // === Logos ===
                $barangayLogo = $this->barangay->logo_path
                    ? storage_path('app/public/' . $this->barangay->logo_path)
                    : public_path('images/csa-logo.png');
                $cityLogo = public_path('images/city-of-ilagan.png');

                $logoLeft = new Drawing();
                $logoLeft->setPath($barangayLogo);
                $logoLeft->setHeight(80);
                $logoLeft->setCoordinates('A1');
                $logoLeft->setOffsetX(15)->setOffsetY(15);
                $logoLeft->setWorksheet($sheet);

                $logoRight = new Drawing();
                $logoRight->setPath($cityLogo);
                $logoRight->setHeight(80);
                $logoRight->setCoordinates($lastColumn . '1');
                $logoRight->setOffsetX(30)->setOffsetY(15);
                $logoRight->setWorksheet($sheet);

                // === Titles ===
                $sheet->setCellValue('A1', 'HOUSEHOLDS LIST FOR ' . now()->year);
                $sheet->setCellValue('A2', 'Barangay: ' . $this->barangay->barangay_name);
                $sheet->setCellValue('A3', 'Region II, Isabela, ' . $this->barangay->city);
                $sheet->mergeCells("A1:{$lastColumn}1");
                $sheet->mergeCells("A2:{$lastColumn}2");
                $sheet->mergeCells("A3:{$lastColumn}3");

                $sheet->getRowDimension(1)->setRowHeight(60);
                $sheet->getRowDimension(2)->setRowHeight(20);
                $sheet->getRowDimension(3)->setRowHeight(20);

                $sheet->setCellValue('A4', "Total Households: {$this->totalRecords}");
                $sheet->getStyle('A4')->getFont()->setBold(true)->setItalic(true)->setSize(12);
                $sheet->getStyle('A4')->getAlignment()->setHorizontal('left');

                // Style titles
                $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(16);
                $sheet->getStyle('A1')->getAlignment()->setHorizontal('center');
                $sheet->getStyle('A2:A3')->getFont()->setBold(true)->setSize(12);
                $sheet->getStyle('A2:A3')->getAlignment()->setHorizontal('center');

                // === Adjust column widths ===
                $columnWidths = [
                    'A' => 5,   // ID
                    'B' => 25,  // Head
                    'C' => 12,  // House Number
                    'D' => 25,  // Street
                    'E' => 10,  // Purok
                    'F' => 20,  // Ownership
                    'G' => 20,  // Condition
                    'H' => 20,  // Structure
                    'I' => 15,  // Year
                    'J' => 12,  // Rooms
                    'K' => 12,  // Floors
                    'L' => 15,  // Members
                ];
                foreach ($columnWidths as $col => $width) {
                    $sheet->getColumnDimension($col)->setWidth($width);
                }

                // === Header row styling ===
                $headerRow = 5;
                $sheet->getStyle("A{$headerRow}:{$lastColumn}{$headerRow}")->applyFromArray([
                    'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                    'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '1a66ff']],
                    'alignment' => ['horizontal' => 'center', 'vertical' => 'center'],
                    'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]],
                ]);

                // Row height
                for ($r = $headerRow; $r <= $sheet->getHighestRow(); $r++) {
                    $sheet->getRowDimension($r)->setRowHeight(20);
                }

                // Borders
                $lastRow = $sheet->getHighestRow();
                if ($lastRow > $headerRow) {
                    $sheet->getStyle("A" . ($headerRow + 1) . ":{$lastColumn}{$lastRow}")
                        ->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN);
                }

                // === Signatories ===
                $barangayId = auth()->user()->barangay_id;
                $officials = BarangayOfficial::with('resident')
                    ->whereHas('resident', function ($q) use ($barangayId) {
                        $q->where('barangay_id', $barangayId);
                    })
                    ->get();

                $captain = $officials->firstWhere('position', 'barangay_captain')?->resident?->fullname ?? 'N/A';
                $secretary = $officials->firstWhere('position', 'barangay_secretary')?->resident?->fullname ?? 'N/A';

                $signatureStartRow = $sheet->getHighestRow() + 3;
                $halfColumn = floor((Coordinate::columnIndexFromString($lastColumn) + 1) / 2);

                // Captain (left)
                $sheet->mergeCells("A{$signatureStartRow}:" . Coordinate::stringFromColumnIndex($halfColumn) . $signatureStartRow);
                $sheet->setCellValue("A{$signatureStartRow}", "______________________________");
                $sheet->mergeCells("A" . ($signatureStartRow + 1) . ":" . Coordinate::stringFromColumnIndex($halfColumn) . ($signatureStartRow + 1));
                $sheet->setCellValue("A" . ($signatureStartRow + 1), "Hon. " . $captain);
                $sheet->getStyle("A{$signatureStartRow}:" . Coordinate::stringFromColumnIndex($halfColumn) . ($signatureStartRow + 1))
                    ->getAlignment()->setHorizontal('center');

                // Secretary (right)
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
