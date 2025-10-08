<?php

namespace App\Exports;

use App\Models\Summon;
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

class SummonExport implements FromCollection, WithHeadings, ShouldAutoSize, WithEvents
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

        $query = Summon::with([
            'blotter:id,type_of_incident,incident_date,location',
            'blotter.complainants.resident:id,firstname,middlename,lastname,suffix',
            'blotter.respondents.resident:id,firstname,middlename,lastname,suffix',
            'issuedBy:id,resident_id,position',
            'issuedBy.resident:id,firstname,middlename,lastname,suffix',
            'latestTake'
        ])->whereHas('blotter', fn($q) => $q->where('barangay_id', $brgy_id));

        // Correct filters
        if (($status = request('summon_status')) && $status !== 'All') {
            $query->where('status', $status);
        }

        if (($hearing_number = request('hearing_number')) && $hearing_number !== 'All') {
            $query->whereHas('latestTake', fn($q) => $q->where('session_number', $hearing_number));
        }

        if (($hearing_status = request('hearing_status')) && $hearing_status !== 'All') {
            $query->whereHas('latestTake', fn($q) => $q->where('session_status', $hearing_status));
        }

        if (($incident_type = request('incident_type')) && $incident_type !== 'All') {
            $query->whereHas('blotter', fn($q) => $q->where('type_of_incident', $incident_type));
        }

        if ($incident_date = request('incident_date')) {
            $query->whereHas('blotter', fn($q) => $q->whereDate('incident_date', $incident_date));
        }

        if ($search = trim(request('name'))) {
            $query->whereHas('blotter.participants', function ($q) use ($search) {
                $q->whereHas('resident', function ($qr) use ($search) {
                    $qr->whereRaw(
                        "CONCAT(firstname, ' ', middlename, ' ', lastname, ' ', IFNULL(suffix, '')) LIKE ?",
                        ["%{$search}%"]
                    )->orWhereRaw(
                        "CONCAT(firstname, ' ', lastname) LIKE ?",
                        ["%{$search}%"]
                    );
                })->orWhere('name', 'like', "%{$search}%");
            });
        }

        $summons = $query->latest()->get();
        $this->totalRecords = $summons->count();

        // Map for export with row number
        return $summons->map(function ($s, $index) {
            $complainants = $s->blotter->complainants->map(fn($c) =>
                $c->resident
                    ? trim("{$c->resident->firstname} {$c->resident->middlename} {$c->resident->lastname} {$c->resident->suffix}")
                    : ($c->name ?? 'N/A')
            )->implode(', ');

            $respondents = $s->blotter->respondents->map(fn($r) =>
                $r->resident
                    ? trim("{$r->resident->firstname} {$r->resident->middlename} {$r->resident->lastname} {$r->resident->suffix}")
                    : ($r->name ?? 'N/A')
            )->implode(', ');

            $issuedBy = $s->issuedBy?->resident
                ? trim("{$s->issuedBy->resident->firstname} {$s->issuedBy->resident->middlename} {$s->issuedBy->resident->lastname} {$s->issuedBy->resident->suffix}")
                : ($s->issuedBy->position ?? 'N/A');

            $latestTake = $s->latestTake
                ? "Session {$s->latestTake->session_number} ({$s->latestTake->session_status}) on {$s->latestTake->hearing_date}"
                : 'N/A';

            return [
                'No.' => $index + 1,
                'Incident Type' => $s->blotter->type_of_incident ?? 'N/A',
                'Incident Date' => $s->blotter->incident_date ?? 'N/A',
                'Location' => $s->blotter->location ?? 'N/A',
                'Summon Status' => $s->status,
                'Complainants' => $complainants ?: 'N/A',
                'Respondents' => $respondents ?: 'N/A',
                'Issued By' => $issuedBy,
                'Latest Hearing' => $latestTake,
            ];
        });
    }

    public function headings(): array
    {
        return [
            'No.', 'Incident Type', 'Incident Date', 'Location',
            'Summon Status', 'Complainants', 'Respondents', 'Issued By', 'Latest Hearing'
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
                $sheet->insertNewRowBefore(1, 4);

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
                $logoRight->setPath($cityLogo)->setHeight(80)->setCoordinates($lastColumn.'1')->setOffsetX(200)->setOffsetY(5)->setWorksheet($sheet);

                // Titles
                $sheet->setCellValue('A1', 'SUMMON LIST '.now()->year);
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
