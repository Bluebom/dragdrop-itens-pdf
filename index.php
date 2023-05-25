<?php
require __DIR__ . '/vendor/autoload.php';

use src\CertGenerator;

$pdf = new CertGenerator();
$pdf->handle();

?>
<!doctype html>
<html lang="pt_br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
<div class="container">
    <div class="row">
        <div class="col-md-12" id="pdfManager" style="display:none">
            <div class="row" id="selectorContainer">
                <div class="col-fixed-240" id="parametriContainer">
                </div>
                <div class="col-fixed-605">
                    <div id="pageContainer" class="pdfViewer singlePageView dropzone nopadding" style="background-color:transparent">
                        <div id="the-canvas"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12" style="padding:10px">
            <button class="bg-teal-500 rounded-xl text-white p-2" onClick="showCoordinates()">Show PDF Placeholders Coordinates</button>
        </div>
    </div>
</div>

<!-- parameters showed on the left sidebar -->
<input id="parameters" type="hidden"
       value='<?= json_encode(json_decode(file_get_contents('params.json'), true)['params']) ?>'/>
<!-- Below the pdf base 64 rapresentation -->
<input id="pdfBase64" type="hidden"
       value="<?= base64_encode(file_get_contents('generated.pdf')) ?>"/>

<script src="libs/pdf.js"></script>
<script src="libs/interact.js"></script>
<script src="script.js"></script>

</body>
</html>