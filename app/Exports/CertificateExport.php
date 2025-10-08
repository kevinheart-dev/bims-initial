<?php

namespace App\Exports;

use App\Models\Certificate;
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

class CertificateExport implements FromCollection, WithHeadings, ShouldAutoSize, WithEvents
{
    protected $barangay;
    protected $totalRecords;

    public function __construct()
    {
        $this->barangay = Barangay::find(auth()->user()->barangay_id);
    }

    public function collection()
    {
        $barangay_id = auth()->user()->barangay_id;

        $query = Certificate::where('barangay_id', $barangay_id)
            ->with([
                'resident:id,firstname,middlename,lastname,suffix,purok_number',
                'document:id,name',
                'issuedBy:id,position'
            ])
            ->select('id','resident_id','document_id','request_status','purpose','issued_at','issued_by','control_number');

        // Filter by certificate type
        if ($type = request('certificate_type')) {
            if ($type !== 'All') {
                $query->whereHas('document', fn($q) => $q->where('name', $type));
            }
        }

        // Filter by request_status
        if ($status = request('request_status')) {
            if ($status !== 'All') $query->where('request_status', $status);
        }

        // Filter by issued_by
        if ($issuedBy = request('issued_by')) {
            if ($issuedBy !== 'All') $query->where('issued_by', $issuedBy);
        }

        // Filter by issued_at
        if ($issuedAt = request('issued_at')) {
            try {
                $date = \Carbon\Carbon::parse($issuedAt)->toDateString();
                $query->whereDate('issued_at', $date);
            } catch (\Exception $e) { /* ignore invalid date */ }
        }

        // Search by resident name, purpose, or document name
        if ($search = trim(request('name', ''))) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('resident', function ($r) use ($search) {
                    $r->where(fn($rr) =>
                        $rr->where('firstname','like',"%{$search}%")
                           ->orWhere('middlename','like',"%{$search}%")
                           ->orWhere('lastname','like',"%{$search}%")
                           ->orWhere('suffix','like',"%{$search}%")
                    );
                })
                ->orWhere('purpose','like',"%{$search}%")
                ->orWhereHas('document', fn($d) => $d->where('name','like',"%{$search}%"));
            });
        }

        $certificates = $query->get();

        $this->totalRecords = $certificates->count();

        // Map for export
        return $certificates->map(fn($cert) => [
            'Resident ID' => $cert->resident_id,
            'Full Name' => trim("{$cert->resident->firstname} {$cert->resident->middlename} {$cert->resident->lastname} {$cert->resident->suffix}"),
            'Purok' => $cert->resident->purok_number,
            'Certificate Type' => $cert->document->name ?? 'N/A',
            'Purpose' => $cert->purpose,
            'Request Status' => $cert->request_status,
            'Issued At' => $cert->issued_at,
            'Issued By' => $cert->issuedBy->position ?? 'N/A',
            'Control Number' => $cert->control_number,
        ]);
    }

    public function headings(): array
    {
        return [
            'Resident ID','Full Name','Purok','Certificate Type','Purpose','Request Status','Issued At','Issued By','Control Number'
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event){
                $sheet = $event->sheet->getDelegate();
                $lastColumn = $sheet->getHighestColumn();
                $lastColumnIndex = Coordinate::columnIndexFromString($lastColumn);

                // Insert rows for logos + title
                $sheet->insertNewRowBefore(1,4);

                $barangayLogo = $this->barangay->logo_path
                    ? storage_path('app/public/'.$this->barangay->logo_path)
                    : public_path('images/csa-logo.png');
                $cityLogo = public_path('images/city-of-ilagan.png');

                $sheet->getRowDimension(1)->setRowHeight(60);
                $sheet->getRowDimension(2)->setRowHeight(20);
                $sheet->getRowDimension(3)->setRowHeight(20);
                $sheet->getRowDimension(4)->setRowHeight(20);

                $logoLeft = new Drawing();
                $logoLeft->setPath($barangayLogo)->setHeight(80)->setCoordinates('A1')->setOffsetX(15)->setOffsetY(5)->setWorksheet($sheet);

                $logoRight = new Drawing();
                $logoRight->setPath($cityLogo)->setHeight(80)->setCoordinates($lastColumn.'1')->setOffsetX(60)->setOffsetY(5)->setWorksheet($sheet);

                // Titles
                $sheet->setCellValue('A1', 'CERTIFICATE LIST '.now()->year);
                $sheet->setCellValue('A2','Barangay: '.$this->barangay->barangay_name);
                $sheet->setCellValue('A3','Region II, Isabela, '.$this->barangay->city);

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
                    'font'=>['bold'=>true,'color'=>['rgb'=>'FFFFFF']],
                    'fill'=>['fillType'=>Fill::FILL_SOLID,'startColor'=>['rgb'=>'1a66ff']],
                    'alignment'=>['horizontal'=>'center','vertical'=>'center'],
                    'borders'=>['allBorders'=>['borderStyle'=>Border::BORDER_THIN]]
                ]);

                $lastRow = $sheet->getHighestRow();
                if($lastRow > $headerRow){
                    $sheet->getStyle("A".($headerRow+1).":{$lastColumn}{$lastRow}")
                        ->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN);
                }

                // Signatories
                $officials = BarangayOfficial::with('resident')
                    ->whereHas('resident', fn($q)=>$q->where('barangay_id',$this->barangay->id))->get();
                $captain = $officials->firstWhere('position','barangay_captain')?->resident?->fullname ?? 'N/A';
                $secretary = $officials->firstWhere('position','barangay_secretary')?->resident?->fullname ?? 'N/A';

                $signatureStartRow = $lastRow + 3;
                $halfColumn = floor(($lastColumnIndex + 1)/2);

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
