<?php

namespace App\Exports;

use App\Models\Resident;
use App\Models\Barangay;
use App\Models\BarangayOfficial;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;

class ResidentsExport implements FromCollection, WithHeadings, ShouldAutoSize, WithEvents
{
    protected $barangay;
    protected $totalRecords;
    protected const EMPLOYMENT_STATUS_TEXT = [
        'student'        => 'Student',
        'employed'       => 'Employed',
        'unemployed'     => 'Unemployed',
        'self_employed'  => 'Self Employed',
        'under_employed' => 'Under Employed',
    ];

    public function __construct()
    {
        $this->barangay = Barangay::find(auth()->user()->barangay_id);
    }

    public function collection()
    {
        $brgy_id = auth()->user()->barangay_id;

        // ✅ Base query (optimized and consistent with index)
        $query = Resident::select([
                'id', 'barangay_id', 'firstname', 'middlename', 'lastname', 'suffix',
                'sex', 'purok_number', 'birthdate', 'civil_status', 'ethnicity', 'religion',
                'contact_number', 'email', 'is_pwd', 'registered_voter', 'employment_status',
            ])
            ->where('barangay_id', $brgy_id)
            ->where('is_deceased', false)
            ->with([
                'occupations' => fn($q) => $q->latest('started_at')->limit(1),
                'socialwelfareprofile:id,resident_id,is_solo_parent,is_4ps_beneficiary',
            ]);

        // ✅ Search by name
        if ($name = trim(request('name'))) {
            $like = "%{$name}%";
            $query->where(function ($q) use ($like) {
                $q->where('firstname', 'like', $like)
                ->orWhere('lastname', 'like', $like)
                ->orWhere('middlename', 'like', $like)
                ->orWhere('suffix', 'like', $like)
                ->orWhereRaw("CONCAT_WS(' ', firstname, middlename, lastname, suffix) LIKE ?", [$like]);
            });
        }

        // ✅ Filters (same as index)
        $filters = [
            'purok' => 'purok_number',
            'sex' => 'sex',
            'gender' => 'gender',
            'estatus' => 'employment_status',
            'cstatus' => 'civil_status',
            'voter_status' => 'registered_voter',
        ];

        foreach ($filters as $param => $column) {
            if (request()->filled($param) && request($param) !== 'All') {
                $query->where($column, request($param));
            }
        }

        // ✅ Age filter (same logic)
        if (($ageGroup = request('age_group')) && $ageGroup !== 'All') {
            $today = Carbon::today();

            [$min, $max] = match ($ageGroup) {
                '0_6_months' => [$today->clone()->subMonths(6), $today],
                '7mos_2yrs'  => [$today->clone()->subYears(2), $today->clone()->subMonths(7)],
                '3_5yrs'     => [$today->clone()->subYears(5), $today->clone()->subYears(3)],
                '6_12yrs'    => [$today->clone()->subYears(12), $today->clone()->subYears(6)],
                '13_17yrs'   => [$today->clone()->subYears(17), $today->clone()->subYears(13)],
                '18_59yrs'   => [$today->clone()->subYears(59), $today->clone()->subYears(18)],
                '60_above'   => [null, $today->clone()->subYears(60)],
                default      => [null, null],
            };

            if ($min && $max) {
                $query->whereBetween('birthdate', [$min, $max]);
            } elseif ($max) {
                $query->where('birthdate', '<=', $max);
            }
        }

        // ✅ Social welfare filters (same logic)
        if (request('fourps') === '1' || request('solo_parent') === '1' || request('pwd') === '1') {
            $query->whereHas('socialwelfareprofile', function ($q) {
                if (request('fourps') === '1') $q->where('is_4ps_beneficiary', 1);
                if (request('solo_parent') === '1') $q->where('is_solo_parent', 1);
                if (request('pwd') === '1') $q->where('is_pwd', 1);
            });
        }

        // ✅ Sorting
        $query->orderBy('purok_number', 'asc')
            ->orderBy('lastname', 'asc')
            ->orderBy('firstname', 'asc');

        // ✅ Execute and transform
        $residents = $query->get();
        $this->totalRecords = $residents->count();

        return $residents->map(fn($r) => [
            'ID' => $r->id,
            'Firstname' => $r->firstname,
            'Middlename' => $r->middlename,
            'Lastname' => $r->lastname,
            'Suffix' => $r->suffix,
            'Sex' => $r->sex,
            'Purok' => $r->purok_number,
            'Birthdate' => $r->birthdate,
            'Age' => $r->age,
            'Civil Status' => $r->civil_status,
            'Ethnicity' => $r->ethnicity,
            'Religion' => $r->religion,
            'Contact Number' => $r->contact_number,
            'Email' => $r->email,
            'Registered Voter' => $r->registered_voter ? 'Yes' : 'No',
            'Employment Status' => $r->employment_status,
            'PWD' => $r->is_pwd ? 'Yes' : 'No',
            'Solo Parent' => $r->socialwelfareprofile?->is_solo_parent ? 'Yes' : 'No',
            '4Ps Beneficiary' => $r->socialwelfareprofile?->is_4ps_beneficiary ? 'Yes' : 'No',
            'Occupation' => $r->occupations->first()?->occupation,
        ]);
    }

    public function headings(): array
    {
        return [
            'ID', 'Firstname', 'Middlename', 'Lastname', 'Suffix', 'Sex', 'Purok',
            'Birthdate', 'Age', 'Civil Status', 'Ethnicity', 'Religion',
            'Contact Number', 'Email', 'Registered Voter', 'Employment Status',
            '4Ps Beneficiary', 'Occupation',
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();
                $lastColumn = $sheet->getHighestColumn();
                $lastColumnIndex = Coordinate::columnIndexFromString($lastColumn);

                // Insert 4 rows for titles + total records
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

                // === Get barangay officials for signatories ===
                $officials = BarangayOfficial::with('resident')
                    ->whereHas('resident', fn($q) => $q->where('barangay_id', $this->barangay->id))
                    ->get();

                $captain   = $officials->firstWhere('position', 'barangay_captain')?->resident?->fullname ?? 'N/A';
                $secretary = $officials->firstWhere('position', 'barangay_secretary')?->resident?->fullname ?? 'N/A';

                // === Left Logo (Barangay) ===
                $logoLeft = new Drawing();
                $logoLeft->setName('Barangay Logo');
                $logoLeft->setDescription('Barangay Logo');
                $logoLeft->setPath($barangayLogo);
                $logoLeft->setHeight(80);
                $logoLeft->setCoordinates('A1');
                $logoLeft->setOffsetX(100);
                $logoLeft->setOffsetY(5);
                $logoLeft->setWorksheet($sheet);

                // === Right Logo (City) ===
                $targetColumn = Coordinate::stringFromColumnIndex($lastColumnIndex);
                $logoRight = new Drawing();
                $logoRight->setName('City Logo');
                $logoRight->setDescription('City Logo');
                $logoRight->setPath($cityLogo);
                $logoRight->setHeight(80);
                $logoRight->setCoordinates($targetColumn . '1'); // put it just past the last column
                $logoRight->setOffsetX(200);
                $logoRight->setOffsetY(5);
                $logoRight->setWorksheet($sheet);

                // === Titles ===
                $sheet->setCellValue('A1', 'RESIDENTS LIST FOR ' . now()->year);
                $sheet->setCellValue('A2', 'Barangay: ' . $this->barangay->barangay_name);
                $sheet->setCellValue('A3', 'Region II, Isabela, ' . $this->barangay->city);
                $sheet->mergeCells("A1:{$lastColumn}1");
                $sheet->mergeCells("A2:{$lastColumn}2");
                $sheet->mergeCells("A3:{$lastColumn}3");

                // Row heights
                $sheet->getRowDimension(1)->setRowHeight(60);
                $sheet->getRowDimension(2)->setRowHeight(20);
                $sheet->getRowDimension(3)->setRowHeight(20);

                // Total records
                $sheet->setCellValue('A4', "Total Records: {$this->totalRecords}");
                $sheet->getStyle('A4')->getFont()->setBold(true)->setItalic(true)->setSize(12);
                $sheet->getStyle('A4')->getAlignment()->setHorizontal('left');

                // Style main titles
                $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(16);
                $sheet->getStyle('A1')->getAlignment()->setHorizontal('center');
                $sheet->getStyle('A2:A3')->getFont()->setBold(true)->setSize(12);
                $sheet->getStyle('A2:A3')->getAlignment()->setHorizontal('center');

                // Header row styling
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

                // === Signatories (auto-center in halves) ===
                $signatureStartRow = $lastRow + 3;
                $halfColumn        = floor($lastColumnIndex / 2);

                // Captain - left half
                $sheet->mergeCells("A{$signatureStartRow}:" . Coordinate::stringFromColumnIndex($halfColumn) . $signatureStartRow);
                $sheet->setCellValue("A{$signatureStartRow}", "______________________________");
                $sheet->mergeCells("A" . ($signatureStartRow + 1) . ":" . Coordinate::stringFromColumnIndex($halfColumn) . ($signatureStartRow + 1));
                $sheet->setCellValue("A" . ($signatureStartRow + 1), "Hon. ".$captain);
                $sheet->getStyle("A{$signatureStartRow}:" . Coordinate::stringFromColumnIndex($halfColumn) . ($signatureStartRow + 1))
                    ->getAlignment()->setHorizontal('center');

                // Secretary - right half
                $sheet->mergeCells(Coordinate::stringFromColumnIndex($halfColumn + 1) . "{$signatureStartRow}:{$lastColumn}{$signatureStartRow}");
                $sheet->setCellValue(Coordinate::stringFromColumnIndex($halfColumn + 1) . "{$signatureStartRow}", "______________________________");
                $sheet->mergeCells(Coordinate::stringFromColumnIndex($halfColumn + 1) . ($signatureStartRow + 1) . ":{$lastColumn}" . ($signatureStartRow + 1));
                $sheet->setCellValue(Coordinate::stringFromColumnIndex($halfColumn + 1) . ($signatureStartRow + 1), "Hon. ".$secretary);
                $sheet->getStyle(Coordinate::stringFromColumnIndex($halfColumn + 1) . "{$signatureStartRow}:{$lastColumn}" . ($signatureStartRow + 1))
                    ->getAlignment()->setHorizontal('center');

                // Freeze pane below header
                $sheet->freezePane("A" . ($headerRow + 1));
            }
        ];
    }


}
