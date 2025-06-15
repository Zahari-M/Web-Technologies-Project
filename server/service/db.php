<?php
$credFile = file_get_contents('../../cred.json');
$cred = json_decode(json_decode($credFile, true)['SecretString'], true)
$endpoint = file_get_contents("../../endpoint.txt");
$dsn = "mysql:host=$endpoint;dbname=ASCII;charset=utf8mb4";
$username = cred['username'];
$password = cred['password'];

try {
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}