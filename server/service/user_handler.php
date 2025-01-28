<?php
require 'db.php';

function doesUserExist($username)
{
    global $pdo;

    $sql = "SELECT id FROM users WHERE username = :username";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['username' => $username]);
    return $stmt->fetch(PDO::FETCH_ASSOC) !== false;
}

function registerUser($username, $password)
{
    global $pdo;
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $sql = "INSERT INTO users (username, password) VALUES (:username, :password)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['username' => $username, 'password' => $hashedPassword]);
    return $pdo->lastInsertId();
}

function loginUser($username, $password)
{
    global $pdo;
    $sql = "SELECT * FROM users WHERE username = :username";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['username' => $username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
        return $user;
    }
    return false;
}

function getUserById($userId)
{
    global $pdo;
    $sql = "SELECT id, username FROM users WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['id' => $userId]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function getMelodyById($userId, $melodyId) {
    global $pdo;

    $sql = "SELECT id, title FROM melodies WHERE id = :melody_id AND user_id = :user_id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['melody_id' => $melodyId, 'user_id' => $userId]);
    $melody = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($melody) {
        $melody['chords'] = getMelodyChords($melody['id']);
        return $melody;
    }

    return null;
}