<?php
require 'service/db.php';
require 'service/user_handler.php';
require 'service/melody_handler.php';

function sendResponse($status, $data = null, $message = null)
{
    http_response_code($status);
    echo json_encode(['data' => $data, 'message' => $message]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : null;

header('Content-Type: application/json');

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    switch ($action) {
        case 'register':
            $username = isset($input['username']) ? $input['username'] : '';
            $password = isset($input['password']) ? $input['password'] : '';

            if (empty($username) || empty($password)) {
                sendResponse(400, null, 'Username and password are required.');
            }

            if (doesUserExist($username)) {
                sendResponse(409, null, 'Username already exists. Please choose a different one.');
            }

            try {
                $userId = registerUser($username, $password);
                sendResponse(201, ['user_id' => $userId], 'User registered successfully.');
            } catch (Exception $e) {
                sendResponse(500, null, 'Failed to register user: ' . $e->getMessage());
            }
            break;

        case 'login':
            $username = isset($input['username']) ? $input['username'] : '';
            $password = isset($input['password']) ? $input['password'] : '';

            if (empty($username) || empty($password)) {
                sendResponse(400, null, 'Username and password are required.');
            }

            $user = loginUser($username, $password);
            if ($user) {
                sendResponse(200, ['user_id' => $user['id'], 'username' => $user['username']], 'Login successful.');
            } else {
                sendResponse(401, null, 'Invalid username or password.');
            }
            break;

        case 'save_melody':
            $userId = isset($input['user_id']) ? $input['user_id'] : 0;
            $title = isset($input['title']) ? $input['title'] : '';
            $chords = isset($input['chords']) ? $input['chords'] : [];

            if (empty($userId) || empty($title) || empty($chords)) {
                sendResponse(400, null, 'User ID, title, and chords are required.');
            }

            try {
                saveMelody($userId, $title, $chords);
                sendResponse(201, ['status' => 'success'], 'Melody and chords saved successfully.');
            } catch (Exception $e) {
                sendResponse(500, null, 'Failed to save melody: ' . $e->getMessage());
            }
            break;

        default:
            sendResponse(404, null, 'Invalid action.');
    }
} elseif ($method === 'GET') {
    switch ($action) {
        case 'get_user':
            $userId = isset($_GET['user_id']) ? $_GET['user_id'] : 0;

            if (empty($userId)) {
                sendResponse(400, null, 'User ID is required.');
            }

            $user = getUserById($userId);
            if ($user) {
                sendResponse(200, $user, 'User retrieved successfully.');
            } else {
                sendResponse(404, null, 'User not found.');
            }
            break;

        case 'get_melodies':
            $userId = isset($_GET['user_id']) ? $_GET['user_id'] : 0;

            if (empty($userId)) {
                sendResponse(400, null, 'User ID is required.');
            }

            $melodies = getUserMelodies($userId);
            sendResponse(200, $melodies, 'Melodies retrieved successfully.');
            break;

        default:
            sendResponse(404, null, 'Invalid action.');
    }
} else {
    sendResponse(405, null, 'Method not allowed.');
}
