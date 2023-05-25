<?php
$_POST = json_decode(file_get_contents('php://input'), true);

$data = file_get_contents('params.json');

$json = (array)json_decode($data, true);
$params = $json["params"];

$request = $_POST['coords'];

foreach ($request as $row){
    foreach ($params as $key => $param){
        if($param["id"] == $row["id"]){
            $params[$key]["xPosition"] = (float)$row['xPosition'];
            $params[$key]["yPosition"] = (float)$row['yPosition'];
        }
    }
}

$data = json_encode(["params" => $params], 128);

file_put_contents("params.json", $data);
echo "<pre>";
print_r(json_encode(["message" => "Sucesso"]));
die();