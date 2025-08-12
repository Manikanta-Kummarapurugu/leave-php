
<?php
include_once '../../config/database.php';

header('Content-Type: application/json');

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->DEPTNAME) && !empty($data->DEPTSHORTNAME)) {
        $query = "INSERT INTO tbldepts (DEPTNAME, DEPTSHORTNAME) VALUES (:deptname, :deptshortname)";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":deptname", $data->DEPTNAME);
        $stmt->bindParam(":deptshortname", $data->DEPTSHORTNAME);
        
        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Department created successfully"
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Failed to create department"
            ]);
        }
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Required fields missing"
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "message" => "Only POST method allowed"
    ]);
}
?>
