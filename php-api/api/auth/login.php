
<?php
include_once '../../config/database.php';

header('Content-Type: application/json');

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->username) && !empty($data->password)) {
        $query = "SELECT * FROM tblemployee WHERE USERNAME = :username AND PASSWRD = :password AND ACCSTATUS = 'YES' LIMIT 1";
        $stmt = $db->prepare($query);
        
        $hashed_password = sha1($data->password);
        $stmt->bindParam(":username", $data->username);
        $stmt->bindParam(":password", $hashed_password);
        
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            unset($user['PASSWRD']); // Remove password from response
            
            echo json_encode([
                "success" => true,
                "message" => "Login successful",
                "user" => $user
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Invalid credentials"
            ]);
        }
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Username and password required"
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "message" => "Only POST method allowed"
    ]);
}
?>
