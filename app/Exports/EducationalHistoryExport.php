<?php

namespace App\Exports;

use App\Models\EducationalHistory;
use App\Models\Barangay;
use App\Models\BarangayOfficial;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;

class EducationalHistoryExport implements FromCollection, WithHeadings, ShouldAutoSize, WithEvents
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

        $query = EducationalHistory::with([
            'resident:id,firstname,lastname,middlename,suffix,purok_number,barangay_id'
        ])->whereHas('resident', function ($q) use ($brgy_id) {
            $q->where('barangay_id', $brgy_id);
        });

        // Filters
        if (request()->filled('latest_education') && request('latest_education') === '1') {
            $query = EducationalHistory::select('educational_histories.*')
                ->join(DB::raw('(
                    SELECT resident_id, MAX(year_ended) AS max_year
                    FROM educational_histories
                    GROUP BY resident_id
                ) AS latest'), function ($join) {
                    $join->on('educational_histories.resident_id', '=', 'latest.resident_id')
                         ->on('educational_histories.year_ended', '=', 'latest.max_year');
                })
                ->with(['resident:id,firstname,lastname,middlename,suffix,purok_number,barangay_id'])
                ->whereHas('resident', fn($q) => $q->where('barangay_id', auth()->user()->barangay_id));
        }

        if (request()->filled('name')) {
            $search = request('name');
            $query->where(function ($q) use ($search) {
                $q->whereHas('resident', function ($qr) use ($search) {
                    $qr->whereRaw(
                        "CONCAT(firstname, ' ', middlename, ' ', lastname, ' ', COALESCE(suffix,'')) LIKE ?",
                        ["%{$search}%"]
                    )->orWhereRaw("CONCAT(firstname, ' ', lastname) LIKE ?", ["%{$search}%"]);
                })
                ->orWhere('school_name', 'like', "%{$search}%")
                ->orWhere('program', 'like', "%{$search}%");
            });
        }

        // Additional filters
        foreach (['purok', 'educational_attainment', 'educational_status', 'school_type', 'year_started', 'year_ended'] as $field) {
            if (request()->filled($field) && request($field) !== 'All') {
                if ($field === 'purok') {
                    $query->whereHas('resident', fn($q) => $q->where('purok_number', request($field)));
                } else {
                    $query->where($field, request($field));
                }
            }
        }

        $educations = $query->get();

        // Map for export
        $exportData = $educations->map(function ($education) {
            $resident = $education->resident;
            $fullName = trim("{$resident->firstname} {$resident->middlename} {$resident->lastname} {$resident->suffix}");
            return [
                'Resident ID' => $resident->id,
                'Full Name' => $fullName,
                'Purok' => $resident->purok_number,
                'School Name' => $education->school_name,
                'School Type' => $education->school_type,
                'Educational Attainment' => $education->educational_attainment,
                'Education Status' => $education->education_status,
                'Year Started' => $education->year_started,
                'Year Ended' => $education->year_ended,
                'Program' => $education->program,
            ];
        });

        $this->totalRecords = $exportData->count();
        return $exportData;
    }

    public function headings(): array
    {
        return [
            'Resident ID', 'Full Name', 'Purok', 'School Name', 'School Type',
            'Educational Attainment', 'Education Status', 'Year Started', 'Year Ended', 'Program'
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();
                $lastColumn = $sheet->getHighestColumn();
                $lastColumnIndex = Coordinate::columnIndexFromString($lastColumn);

                // Insert rows for logos + titles
                $sheet->insertNewRowBefore(1, 4);

                // Logos
                $barangayLogo = $this->barangay->logo_path
                    ? storage_path('app/public/' . $this->barangay->logo_path)
                    : public_path('images/csa-logo.png');
                $cityLogo = public_path('images/city-of-ilagan.png');

                $sheet->getRowDimension(1)->setRowHeight(60);
                $sheet->getRowDimension(2)->setRowHeight(20);
                $sheet->getRowDimension(3)->setRowHeight(20);
                $sheet->getRowDimension(4)->setRowHeight(20);

                $logoLeft = new Drawing();
                $logoLeft->setPath($barangayLogo)->setHeight(80)->setCoordinates('A1')->setOffsetX(15)->setOffsetY(5)->setWorksheet($sheet);

                $logoRight = new Drawing();
                $logoRight->setPath($cityLogo)->setHeight(80)->setCoordinates($lastColumn . '1')->setOffsetX(120)->setOffsetY(5)->setWorksheet($sheet);

                // Titles
                $sheet->setCellValue('A1', 'EDUCATIONAL HISTORY ' . now()->year);
                $sheet->setCellValue('A2', 'Barangay: ' . $this->barangay->barangay_name);
                $sheet->setCellValue('A3', 'Region II, Isabela, ' . $this->barangay->city);

                $sheet->mergeCells("A1:{$lastColumn}1");
                $sheet->mergeCells("A2:{$lastColumn}2");
                $sheet->mergeCells("A3:{$lastColumn}3");

                $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(16);
                $sheet->getStyle('A1')->getAlignment()->setHorizontal('center')->setVertical('center');

                $sheet->getStyle('A2:A3')->getFont()->setBold(true)->setSize(12);
                $sheet->getStyle('A2:A3')->getAlignment()->setHorizontal('center')->setVertical('center');

                $sheet->setCellValue('A4', "Total Records: {$this->totalRecords}");
                $sheet->mergeCells("A4:{$lastColumn}4");
                $sheet->getStyle('A4')->getFont()->setBold(true)->setItalic(true)->setSize(12);
                $sheet->getStyle('A4')->getAlignment()->setHorizontal('left')->setVertical('center');

                // Header row styling
                $headerRow = 5;
                $sheet->getStyle("A{$headerRow}:{$lastColumn}{$headerRow}")->applyFromArray([
                    'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                    'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '1a66ff']],
                    'alignment' => ['horizontal' => 'center', 'vertical' => 'center'],
                    'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]],
                ]);

                $lastRow = $sheet->getHighestRow();
                if ($lastRow > $headerRow) {
                    $sheet->getStyle("A" . ($headerRow + 1) . ":{$lastColumn}{$lastRow}")
                        ->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN);
                }

                // Signatories
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
                $sheet->getStyle("A{$signatureStartRow}:" . Coordinate::stringFromColumnIndex($halfColumn) . ($signatureStartRow + 1))->getAlignment()->setHorizontal('center');

                $sheet->mergeCells(Coordinate::stringFromColumnIndex($halfColumn + 1) . "{$signatureStartRow}:{$lastColumn}{$signatureStartRow}");
                $sheet->setCellValue(Coordinate::stringFromColumnIndex($halfColumn + 1) . "{$signatureStartRow}", "______________________________");
                $sheet->mergeCells(Coordinate::stringFromColumnIndex($halfColumn + 1) . ($signatureStartRow + 1) . ":{$lastColumn}" . ($signatureStartRow + 1));
                $sheet->setCellValue(Coordinate::stringFromColumnIndex($halfColumn + 1) . ($signatureStartRow + 1), "Hon. " . $secretary);
                $sheet->getStyle(Coordinate::stringFromColumnIndex($halfColumn + 1) . "{$signatureStartRow}:{$lastColumn}" . ($signatureStartRow + 1))->getAlignment()->setHorizontal('center');

                $sheet->freezePane("A" . ($headerRow + 1));
            }
        ];
    }
}
