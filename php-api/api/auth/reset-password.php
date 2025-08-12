
<?php
include_once '../../config/database.php';

header('Content-Type: application/json');

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->currentPassword) && !empty($data->newPassword) && !empty($data->userId)) {
        // Verify current password
        $query = "SELECT PASSWRD FROM tblemployee WHERE EMPID = :userId LIMIT 1";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":userId", $data->userId);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            $current_hashed = sha1($data->currentPassword);
            
            if ($user['PASSWRD'] === $current_hashed) {
                // Update password
                $new_hashed = sha1($data->newPassword);
                $update_query = "UPDATE tblemployee SET PASSWRD = :newPassword WHERE EMPID = :userId";
                $update_stmt = $db->prepare($update_query);
                $update_stmt->bindParam(":newPassword", $new_hashed);
                $update_stmt->bindParam(":userId", $data->userId);
                
                if ($update_stmt->execute()) {
                    echo json_encode([
                        "success" => true,
                        "message" => "Password updated successfully"
                    ]);
                } else {
                    echo json_encode([
                        "success" => false,
                        "message" => "Failed to update password"
                    ]);
                }
            } else {
                echo json_encode([
                    "success" => false,
                    "message" => "Current password is incorrect"
                ]);
            }
        } else {
            echo json_encode([
                "success" => false,
                "message" => "User not found"
            ]);
        }
    } else {
        echo json_encode([
            "success" => false,
            "message" => "All fields are required"
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "message" => "Only POST method allowed"
    ]);
}
?>
