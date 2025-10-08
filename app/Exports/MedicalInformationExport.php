<?php

namespace App\Exports;

use App\Models\MedicalInformation;
use App\Models\Barangay;
use App\Models\BarangayOfficial;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;

class MedicalInformationExport implements FromCollection, WithHeadings, ShouldAutoSize, WithEvents
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

        $query = MedicalInformation::with([
                'resident:id,firstname,middlename,lastname,suffix,purok_number,sex,birthdate'
            ])
            ->whereHas('resident', fn($q) => $q->where('barangay_id', $brgy_id));

        // 🔹 Filters
        if ($name = request('name')) {
            $query->whereHas('resident', function ($q) use ($name) {
                $like = "%{$name}%";
                $q->where('firstname', 'like', $like)
                  ->orWhere('middlename', 'like', $like)
                  ->orWhere('lastname', 'like', $like)
                  ->orWhere('suffix', 'like', $like)
                  ->orWhereRaw("CONCAT(firstname, ' ', lastname) LIKE ?", [$like])
                  ->orWhereRaw("CONCAT(firstname, ' ', middlename, ' ', lastname) LIKE ?", [$like]);
            });
        }

        if (($purok = request('purok')) && $purok !== 'All') {
            $query->whereHas('resident', fn($q) => $q->where('purok_number', $purok));
        }

        if (($sex = request('sex')) && $sex !== 'All') {
            $query->whereHas('resident', fn($q) => $q->where('sex', $sex));
        }

        if (($is_pwd = request('is_pwd')) && $is_pwd !== 'All') {
            $query->whereHas('resident', fn($q) => $q->where('is_pwd', $is_pwd));
        }

        if (($blood = request('blood_type')) && $blood !== 'All') {
            $query->where('blood_type', $blood);
        }

        if (($nutrition = request('nutritional_status')) && $nutrition !== 'All') {
            $query->where('nutrition_status', $nutrition);
        }

        if (($smoker = request('is_smoker')) && $smoker !== 'All') {
            $query->where('is_smoker', $smoker);
        }

        if (($alcohol = request('alcohol_user')) && $alcohol !== 'All') {
            $query->where('is_alcohol_user', $alcohol);
        }

        if (($philhealth = request('has_philhealth')) && $philhealth !== 'All') {
            $query->where('has_philhealth', $philhealth);
        }

        $records = $query->get();
        $this->totalRecords = $records->count();

        return $records->map(fn($m) => [
            'Number' => $m->id,
            'Firstname' => $m->resident?->firstname,
            'Middlename' => $m->resident?->middlename,
            'Lastname' => $m->resident?->lastname,
            'Suffix' => $m->resident?->suffix,
            'Sex' => $m->resident?->sex,
            'Purok' => $m->resident?->purok_number,
            'Birthdate' => $m->resident?->birthdate,
            'Weight (kg)' => $m->weight_kg,
            'Height (cm)' => $m->height_cm,
            'BMI' => $m->bmi,
            'Nutrition Status' => $m->nutrition_status,
            'Blood Type' => $m->blood_type,
            'Smoker' => $m->is_smoker ? 'Yes' : 'No',
            'Alcohol User' => $m->is_alcohol_user ? 'Yes' : 'No',
            'Has PhilHealth' => $m->has_philhealth ? 'Yes' : 'No',
            'PhilHealth ID' => $m->philhealth_id_number,
            'PWD ID' => $m->pwd_id_number,
            'Emergency Contact Name' => $m->emergency_contact_name,
            'Emergency Contact Number' => $m->emergency_contact_number,
            'Emergency Contact Relationship' => $m->emergency_contact_relationship,
        ]);
    }

    public function headings(): array
    {
        return [
            'Number', 'Firstname', 'Middlename', 'Lastname', 'Suffix', 'Sex', 'Purok', 'Birthdate',
            'Weight (kg)', 'Height (cm)', 'BMI', 'Nutrition Status', 'Blood Type', 'Smoker', 'Alcohol User',
            'Has PhilHealth', 'PhilHealth ID', 'PWD ID', 'Emergency Contact Name', 'Emergency Contact Number',
            'Emergency Contact Relationship',
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();
                $lastColumn = $sheet->getHighestColumn();
                $lastColumnIndex = Coordinate::columnIndexFromString($lastColumn);

                // Insert header rows
                $sheet->insertNewRowBefore(1, 4);

                $barangayLogo = $this->barangay->logo_path
                    ? storage_path('app/public/'.$this->barangay->logo_path)
                    : public_path('images/csa-logo.png');
                $cityLogo = public_path('images/city-of-ilagan.png');

                // Adjust row heights
                $sheet->getRowDimension(1)->setRowHeight(80); // accommodates logos
                $sheet->getRowDimension(2)->setRowHeight(20);
                $sheet->getRowDimension(3)->setRowHeight(20);
                $sheet->getRowDimension(4)->setRowHeight(20); // Total Records row

                // Left Logo (Barangay)
                $logoLeft = new Drawing();
                $logoLeft->setName('Barangay Logo');
                $logoLeft->setDescription('Barangay Logo');
                $logoLeft->setPath($barangayLogo);
                $logoLeft->setHeight(80);
                $logoLeft->setCoordinates('A1'); // stays in row 1
                $logoLeft->setOffsetX(10);       // small padding from left
                $logoLeft->setOffsetY(10);        // align top
                $logoLeft->setWorksheet($sheet);

                // Right Logo (City)
                $logoRight = new Drawing();
                $logoRight->setName('City Logo');
                $logoRight->setDescription('City Logo');
                $logoRight->setPath($cityLogo);
                $logoRight->setHeight(80);
                $logoRight->setCoordinates($lastColumn.'1'); // stays in row 1
                $logoRight->setOffsetX(90);        // align right
                $logoRight->setOffsetY(10);        // align top
                $logoRight->setWorksheet($sheet);

                // Titles
                $sheet->setCellValue('A1', 'MEDICAL INFORMATION LIST ' . now()->year);
                $sheet->setCellValue('A2', 'Barangay: ' . $this->barangay->barangay_name);
                $sheet->setCellValue('A3', 'Region II, Isabela, ' . $this->barangay->city);

                $sheet->mergeCells("A1:{$lastColumn}1");
                $sheet->mergeCells("A2:{$lastColumn}2");
                $sheet->mergeCells("A3:{$lastColumn}3");

                $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(16);
                $sheet->getStyle('A1')->getAlignment()->setHorizontal('center')->setVertical('center');

                $sheet->getStyle('A2:A3')->getFont()->setBold(true)->setSize(12);
                $sheet->getStyle('A2:A3')->getAlignment()->setHorizontal('center')->setVertical('center');

                // Total Records
                $sheet->setCellValue('A4', "Total Records: {$this->totalRecords}");
                $sheet->mergeCells("A4:{$lastColumn}4");
                $sheet->getStyle('A4')->getFont()->setBold(true)->setItalic(true)->setSize(12);
                $sheet->getStyle('A4')->getAlignment()->setHorizontal('left')->setVertical('center');

                // Header row styling
                $headerRow = 5;
                $sheet->getStyle("A{$headerRow}:{$lastColumn}{$headerRow}")->applyFromArray([
                    'font' => ['bold' => true, 'color' => ['rgb'=>'FFFFFF']],
                    'fill' => ['fillType'=>Fill::FILL_SOLID,'startColor'=>['rgb'=>'1a66ff']],
                    'alignment' => ['horizontal'=>'center','vertical'=>'center'],
                    'borders'=>['allBorders'=>['borderStyle'=>Border::BORDER_THIN]],
                ]);

                $lastRow = $sheet->getHighestRow();
                if($lastRow > $headerRow){
                    $sheet->getStyle("A".($headerRow+1).":{$lastColumn}{$lastRow}")
                        ->getBorders()->getAllBorders()
                        ->setBorderStyle(Border::BORDER_THIN);
                }

                // Signatories
                $officials = BarangayOfficial::with('resident')
                    ->whereHas('resident', fn($q)=>$q->where('barangay_id',$this->barangay->id))->get();
                $captain = $officials->firstWhere('position','barangay_captain')?->resident?->fullname ?? 'N/A';
                $secretary = $officials->firstWhere('position','barangay_secretary')?->resident?->fullname ?? 'N/A';

                $signatureStartRow = $lastRow + 3;
                $halfColumn = floor(($lastColumnIndex+1)/2);

                $sheet->mergeCells("A{$signatureStartRow}:".Coordinate::stringFromColumnIndex($halfColumn).$signatureStartRow);
                $sheet->setCellValue("A{$signatureStartRow}","______________________________");
                $sheet->mergeCells("A".($signatureStartRow+1).":".Coordinate::stringFromColumnIndex($halfColumn).($signatureStartRow+1));
                $sheet->setCellValue("A".($signatureStartRow+1),"Hon. ".$captain);
                $sheet->getStyle("A{$signatureStartRow}:".Coordinate::stringFromColumnIndex($halfColumn).($signatureStartRow+1))->getAlignment()->setHorizontal('center');

                $sheet->mergeCells(Coordinate::stringFromColumnIndex($halfColumn+1)."{$signatureStartRow}:{$lastColumn}{$signatureStartRow}");
                $sheet->setCellValue(Coordinate::stringFromColumnIndex($halfColumn+1)."{$signatureStartRow}","______________________________");
                $sheet->mergeCells(Coordinate::stringFromColumnIndex($halfColumn+1).($signatureStartRow+1).":{$lastColumn}".($signatureStartRow+1));
                $sheet->setCellValue(Coordinate::stringFromColumnIndex($halfColumn+1).($signatureStartRow+1),"Hon. ".$secretary);
                $sheet->getStyle(Coordinate::stringFromColumnIndex($halfColumn+1)."{$signatureStartRow}:{$lastColumn}".($signatureStartRow+1))->getAlignment()->setHorizontal('center');

                $sheet->freezePane("A".($headerRow+1));
            }
        ];
    }
}
