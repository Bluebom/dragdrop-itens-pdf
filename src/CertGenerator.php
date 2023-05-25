<?php

namespace src;
use setasign\Fpdi\PdfParser\CrossReference\CrossReferenceException;
use setasign\Fpdi\PdfParser\Filter\FilterException;
use setasign\Fpdi\PdfParser\PdfParserException;
use setasign\Fpdi\PdfParser\Type\PdfTypeException;
use setasign\Fpdi\PdfReader\PdfReaderException;
use setasign\Fpdi\Tcpdf\Fpdi;

class CertGenerator
{
    protected Fpdi $pdf;
    protected float $pageOneXP = 0.348;
    protected float $pageOneYP = 0.34269;

    protected float $pageTwoXP = 0.351;
    protected float $pageTwoYP = 0.344;

    /**
     * @throws PdfTypeException
     * @throws CrossReferenceException
     * @throws PdfReaderException
     * @throws PdfParserException
     * @throws FilterException
     */
    public function __construct()
    {
        $this->pdf = new Fpdi();
        $this->pdf->AddPage();
        $this->pdf->setSourceFile(__DIR__.'/../teste.pdf');
        // Frente
        $tplId = $this->pdf->importPage(1);
        $this->pdf->useTemplate($tplId, 0, 75, 210);
        // Verso
        $this->pdf->AddPage();
        $tplId = $this->pdf->importPage(2);
        $this->pdf->useTemplate($tplId, 0, 75, 210);

        $this->pdf->Output(__DIR__.'/../generated.pdf', 'F');
    }

    public function handle()
    {
        $data = file_get_contents('params.json');
        $json = (array)json_decode($data, true);
        $params = $json["params"];

        $this->pdf = new Fpdi();
        $this->pdf->AddPage();
        $this->pdf->setSourceFile(__DIR__.'/../teste.pdf');
        $this->pdf->SetFont('helvetica', 'i', 9);
        // Frente
        $tplId = $this->pdf->importPage(1);
        $this->pdf->useTemplate($tplId, 0, 75, 210);
        // input
        $this->pdf->SetXY(
            $params[0]["xPosition"]*$this->pageOneXP,
            $params[0]["yPosition"]*$this->pageOneYP
        );
        $this->pdf->Cell(0, 10, "Franklin Henrique", 0, 1);

        $this->pdf->SetXY(
            $params[2]["xPosition"]*$this->pageOneXP,
            $params[2]["yPosition"]*$this->pageOneYP
        );
        $this->pdf->Cell(0, 10, "DATA_ALERT", 0, 1);

        $this->pdf->SetXY(
            $params[4]["xPosition"]*$this->pageOneXP,
            $params[4]["yPosition"]*$this->pageOneYP
        );
        $this->pdf->Cell(0, 10, "DATA_MP", 0, 1);

        $this->pdf->SetXY(
            $params[6]["xPosition"]*$this->pageOneXP,
            $params[6]["yPosition"]*$this->pageOneYP
        );
        $this->pdf->Cell(0, 10, "CAUSAL_G60", 0, 1);

        // Verso
        $this->pdf->AddPage();
        $tplId = $this->pdf->importPage(2);
        $this->pdf->useTemplate($tplId, 0, 75, 210);

        $this->pdf->SetXY(
            ($params[1]["xPosition"] - 595)*$this->pageTwoXP,
            $params[1]["yPosition"]*$this->pageTwoYP
        );
        $this->pdf->Cell(0, 10, "Segunda Pagina", 0, 1);

        $this->pdf->SetXY(
            ($params[3]["xPosition"] - 595)*$this->pageTwoXP,
            $params[3]["yPosition"]*$this->pageTwoYP
        );
        $this->pdf->Cell(0, 10, "UP", 0, 1);

        $this->pdf->SetXY(
            ($params[5]["xPosition"] - 595)*$this->pageTwoXP,
            $params[5]["yPosition"]*$this->pageTwoYP
        );
        $this->pdf->Cell(0, 10, "AL_QUALITA", 0, 1);

        $this->pdf->Output(__DIR__.'/../generated.pdf', 'F');
    }
}