<?php

namespace App\Exports;

use App\Models\Occupation;
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
use Illuminate\Support\Facades\DB;

class OccupationExport implements FromCollection, WithHeadings, ShouldAutoSize, WithEvents
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

        $query = Occupation::with([
            'resident:id,firstname,lastname,middlename,suffix,purok_number,employment_status,barangay_id'
        ])->whereHas('resident', fn($q) => $q->where('barangay_id', $brgy_id));

        // Latest occupation filter
        if (request()->filled('latest_occupation') && request('latest_occupation') === '1') {
            $subquery = DB::table('occupations as o1')
                ->select('resident_id', DB::raw('MAX(started_at) as latest_started_at'))
                ->join('residents', 'o1.resident_id', '=', 'residents.id')
                ->where('residents.barangay_id', $brgy_id)
                ->groupBy('resident_id');

            $query = Occupation::from('occupations as o')
                ->joinSub($subquery, 'latest_occupations', function ($join) {
                    $join->on('o.resident_id', '=', 'latest_occupations.resident_id')
                        ->on('o.started_at', '=', 'latest_occupations.latest_started_at');
                })
                ->with([
                    'resident:id,firstname,lastname,middlename,suffix,purok_number,employment_status,barangay_id'
                ])
                ->select(
                    'o.id',
                    'o.resident_id',
                    'o.occupation',
                    'o.employment_type',
                    'o.work_arrangement',
                    'o.employer',
                    'o.occupation_status',
                    'o.is_ofw',
                    'o.is_main_livelihood',
                    'o.started_at',
                    'o.ended_at',
                    'o.monthly_income'
                );
        }

        // Name search
        if ($search = trim(request('name', ''))) {
            $terms = preg_split('/\s+/', $search);
            $query->where(function ($q) use ($terms, $search) {
                $q->where('occupation', 'like', "%{$search}%");
                $q->orWhereHas('resident', function ($r) use ($terms) {
                    foreach ($terms as $term) {
                        $r->where(fn($r2) => $r2->where('firstname', 'like', "%{$term}%")
                            ->orWhere('middlename', 'like', "%{$term}%")
                            ->orWhere('lastname', 'like', "%{$term}%")
                            ->orWhere('suffix', 'like', "%{$term}%"));
                    }
                });
            });
        }

        // Other filters
        foreach (['employment_type', 'work_arrangement', 'occupation_status', 'is_ofw', 'year_started', 'year_ended'] as $field) {
            if (request()->filled($field) && request($field) !== 'All') {
                $query->where($field === 'year_started' ? 'started_at' : ($field === 'year_ended' ? 'ended_at' : $field), request($field));
            }
        }

        // Filters from resident
        if (request()->filled('employment_status') && request('employment_status') !== 'All') {
            $query->whereHas('resident', fn($q) => $q->where('employment_status', request('employment_status')));
        }

        if (request()->filled('purok') && request('purok') !== 'All') {
            $query->whereHas('resident', fn($q) => $q->where('purok_number', request('purok')));
        }

        $occupations = $query->get();

        // Map data for export
        $exportData = $occupations->map(function ($occ) {
            $resident = $occ->resident;
            $fullName = trim("{$resident->firstname} {$resident->middlename} {$resident->lastname} {$resident->suffix}");
            return [
                'Resident ID' => $resident->id,
                'Full Name' => $fullName,
                'Purok' => $resident->purok_number,
                'Occupation' => $occ->occupation,
                'Employment Type' => $occ->employment_type,
                'Work Arrangement' => $occ->work_arrangement,
                'Employer' => $occ->employer,
                'Occupation Status' => $occ->occupation_status,
                'Is OFW' => $occ->is_ofw ? 'Yes' : 'No',
                'Is Main Livelihood' => $occ->is_main_livelihood ? 'Yes' : 'No',
                'Started At' => $occ->started_at,
                'Ended At' => $occ->ended_at,
                'Monthly Income' => $occ->monthly_income,
            ];
        });

        $this->totalRecords = $exportData->count();
        return $exportData;
    }

    public function headings(): array
    {
        return [
            'Resident ID', 'Full Name', 'Purok', 'Occupation', 'Employment Type', 'Work Arrangement',
            'Employer', 'Occupation Status', 'Is OFW', 'Is Main Livelihood', 'Started At', 'Ended At', 'Monthly Income'
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

                $sheet->getRowDimension(1)->setRowHeight(60);
                $sheet->getRowDimension(2)->setRowHeight(20);
                $sheet->getRowDimension(3)->setRowHeight(20);
                $sheet->getRowDimension(4)->setRowHeight(20);

                $logoLeft = new Drawing();
                $logoLeft->setPath($barangayLogo)->setHeight(80)->setCoordinates('A1')->setOffsetX(15)->setOffsetY(5)->setWorksheet($sheet);

                $logoRight = new Drawing();
                $logoRight->setPath($cityLogo)->setHeight(80)->setCoordinates($lastColumn . '1')->setOffsetX(-10)->setOffsetY(5)->setWorksheet($sheet);

                // Titles
                $sheet->setCellValue('A1', 'OCCUPATION LIST ' . now()->year);
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

                // Header styling
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
