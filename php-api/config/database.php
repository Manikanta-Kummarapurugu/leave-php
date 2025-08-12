
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Max-Age: 86400");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

class Database {
    // Update these credentials for your iPage hosting
    private $host = "localhost"; // Usually localhost on iPage
    private $database_name = "leavedb"; // Your database name on iPage
    private $username = "your_db_username"; // Your iPage database username
    private $password = "your_db_password"; // Your iPage database password
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->database_name . ";charset=utf8",
                $this->username, 
                $this->password,
                array(
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"
                )
            );
        } catch(PDOException $exception) {
            echo json_encode(array(
                "success" => false,
                "message" => "Connection error: " . $exception->getMessage()
            ));
            exit();
        }
        return $this->conn;
    }
}

function sendResponse($success, $message, $data = null) {
    header('Content-Type: application/json');
    $response = array(
        "success" => $success,
        "message" => $message
    );
    if ($data !== null) {
        $response["data"] = $data;
    }
    echo json_encode($response);
    exit();
}

function validateToken($token) {
    if (empty($token)) {
        return false;
    }
    // Simple token validation - you can enhance this
    return !empty($token) && strlen($token) > 10;
}

function getAuthHeaders() {
    $headers = array();
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $headers['Authorization'] = $_SERVER['HTTP_AUTHORIZATION'];
    } elseif (isset($_SERVER['HTTP_X_AUTHORIZATION'])) {
        $headers['Authorization'] = $_SERVER['HTTP_X_AUTHORIZATION'];
    } elseif (function_exists('apache_request_headers')) {
        $requestHeaders = apache_request_headers();
        if (isset($requestHeaders['Authorization'])) {
            $headers['Authorization'] = $requestHeaders['Authorization'];
        }
    }
    return $headers;
}
?>
