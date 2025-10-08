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
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;

class SeniorCitizenExport implements FromCollection, WithHeadings, ShouldAutoSize, WithEvents
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
        $today = Carbon::today();

       $query = Resident::query()
        ->select('residents.*') // make sure we select base table columns
        ->with(['seniorcitizen:id,resident_id,osca_id_number,is_pensioner,pension_type,living_alone'])
        ->where('residents.barangay_id', $brgy_id)
        ->whereDate('residents.birthdate', '<=', $today->copy()->subYears(60))
        ->leftJoin('senior_citizens', 'residents.id', '=', 'senior_citizens.resident_id')
        ->distinct();

    // === Filters ===
    if ($name = request('name')) {
        $like = "%{$name}%";
        $query->where(function ($q) use ($like) {
            $q->where('residents.firstname', 'like', $like)
                ->orWhere('residents.lastname', 'like', $like)
                ->orWhere('residents.middlename', 'like', $like)
                ->orWhere('residents.suffix', 'like', $like)
                ->orWhereRaw("CONCAT(residents.firstname, ' ', residents.lastname) LIKE ?", [$like])
                ->orWhereRaw("CONCAT(residents.firstname, ' ', residents.middlename, ' ', residents.lastname) LIKE ?", [$like])
                ->orWhereRaw("CONCAT(residents.firstname, ' ', residents.middlename, ' ', residents.lastname, ' ', residents.suffix) LIKE ?", [$like]);
        });
    }

    if (request()->filled('is_registered') && request('is_registered') !== 'All') {
        if (request('is_registered') === 'yes') {
            $query->whereNotNull('senior_citizens.id');
        } elseif (request('is_registered') === 'no') {
            $query->whereNull('senior_citizens.id');
        }
    }

    if (request()->filled('birth_month') && request('birth_month') !== 'All') {
        $query->whereMonth('residents.birthdate', intval(request('birth_month')));
    }

    if (request()->filled('sex') && request('sex') !== 'All') {
        $query->where('residents.sex', request('sex'));
    }

    if (request()->filled('gender') && request('gender') !== 'All') {
        $query->where('residents.gender', request('gender'));
    }

    if (request()->filled('purok') && request('purok') !== 'All') {
        $query->where('residents.purok_number', request('purok'));
    }

    if (request()->filled('is_pensioner') && request('is_pensioner') !== 'All') {
        $query->where('senior_citizens.is_pensioner', request('is_pensioner'));
    }

    if (request()->filled('pension_type') && request('pension_type') !== 'All') {
        $query->where('senior_citizens.pension_type', request('pension_type'));
    }

    if (request()->filled('living_alone') && request('living_alone') !== 'All') {
        $query->where('senior_citizens.living_alone', request('living_alone'));
    }

        // ✅ Apply sorting: by purok, lastname, firstname
        $query->orderBy('residents.purok_number', 'asc')
            ->orderBy('residents.lastname', 'asc')
            ->orderBy('residents.firstname', 'asc');

        $seniors = $query->get();

        $this->totalRecords = $seniors->count();

        return $seniors->map(fn($resident) => [
            'ID'           => $resident->id,
            'Firstname'    => $resident->firstname,
            'Middlename'   => $resident->middlename,
            'Lastname'     => $resident->lastname,
            'Suffix'       => $resident->suffix,
            'Sex'          => $resident->sex,
            'Purok'        => $resident->purok_number,
            'Birthdate'    => $resident->birthdate,
            'Age'          => $resident->age,
            'OSCA ID'      => $resident->seniorcitizen?->osca_id_number,
            'Is Pensioner' => $resident->seniorcitizen?->is_pensioner ? 'Yes' : 'No',
            'Pension Type' => $resident->seniorcitizen?->pension_type,
            'Living Alone' => $resident->seniorcitizen?->living_alone ? 'Yes' : 'No',
        ]);
    }

    public function headings(): array
    {
        return [
            'ID', 'Firstname', 'Middlename', 'Lastname', 'Suffix', 'Sex', 'Purok', 'Birthdate',
            'Age', 'OSCA ID', 'Is Pensioner', 'Pension Type', 'Living Alone',
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

                // === Logos ===
                $barangayLogo = $this->barangay->logo_path
                    ? storage_path('app/public/' . $this->barangay->logo_path)
                    : public_path('images/csa-logo.png');
                $cityLogo = public_path('images/city-of-ilagan.png');

                $logoLeft = new Drawing();
                $logoLeft->setName('Barangay Logo');
                $logoLeft->setDescription('Barangay Logo');
                $logoLeft->setPath($barangayLogo);
                $logoLeft->setHeight(80);
                $logoLeft->setCoordinates('A1');
                $logoLeft->setOffsetX(15);
                $logoLeft->setOffsetY(15);
                $logoLeft->setWorksheet($sheet);

                $logoRight = new Drawing();
                $logoRight->setName('City Logo');
                $logoRight->setDescription('City Logo');
                $logoRight->setPath($cityLogo);
                $logoRight->setHeight(80);
                $logoRight->setCoordinates($lastColumn . '1');
                $logoRight->setOffsetX(-15);
                $logoRight->setOffsetY(15);
                $logoRight->setWorksheet($sheet);

                // === Officials for signatories ===
                $officials = BarangayOfficial::with('resident')
                    ->whereHas('resident', fn($q) => $q->where('barangay_id', $this->barangay->id))
                    ->get();

                $captain = $officials->firstWhere('position', 'barangay_captain')?->resident?->fullname ?? 'N/A';
                $secretary = $officials->firstWhere('position', 'barangay_secretary')?->resident?->fullname ?? 'N/A';

                // === Titles ===
                $sheet->setCellValue('A1', 'SENIOR CITIZENS LIST ' . now()->year);
                $sheet->setCellValue('A2', 'Barangay: ' . $this->barangay->barangay_name);
                $sheet->setCellValue('A3', 'Region II, Isabela, ' . $this->barangay->city);
                $sheet->mergeCells("A1:{$lastColumn}1");
                $sheet->mergeCells("A2:{$lastColumn}2");
                $sheet->mergeCells("A3:{$lastColumn}3");

                // Set row heights
                $sheet->getRowDimension(1)->setRowHeight(60);
                $sheet->getRowDimension(2)->setRowHeight(20);
                $sheet->getRowDimension(3)->setRowHeight(20);

                // Total records
                $sheet->setCellValue('A4', "Total Records: {$this->totalRecords}");
                $sheet->getStyle('A4')->getFont()->setBold(true)->setItalic(true)->setSize(12);
                $sheet->getStyle('A4')->getAlignment()->setHorizontal('left');

                // Style titles
                $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(16);
                $sheet->getStyle('A1')->getAlignment()->setHorizontal('center');
                $sheet->getStyle('A2:A3')->getFont()->setBold(true)->setSize(12);
                $sheet->getStyle('A2:A3')->getAlignment()->setHorizontal('center');

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
                $signatureStartRow = $lastRow + 3;
                $halfColumn = floor(($lastColumnIndex + 1) / 2);

                // Captain - left
                $sheet->mergeCells("A{$signatureStartRow}:" . Coordinate::stringFromColumnIndex($halfColumn) . $signatureStartRow);
                $sheet->setCellValue("A{$signatureStartRow}", "______________________________");
                $sheet->mergeCells("A" . ($signatureStartRow + 1) . ":" . Coordinate::stringFromColumnIndex($halfColumn) . ($signatureStartRow + 1));
                $sheet->setCellValue("A" . ($signatureStartRow + 1), "Hon. " . $captain);
                $sheet->getStyle("A{$signatureStartRow}:" . Coordinate::stringFromColumnIndex($halfColumn) . ($signatureStartRow + 1))
                    ->getAlignment()->setHorizontal('center');

                // Secretary - right
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
