<?php
require 'db.php';

function saveMelody($userId, $title, $chords)
{
    global $pdo;

    try {
        $pdo->beginTransaction();

        $sql = "INSERT INTO melodies (user_id, title) VALUES (:user_id, :title)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['user_id' => $userId, 'title' => $title]);
        $melodyId = $pdo->lastInsertId();

        $sql = "INSERT INTO chords (melody_id, chord, type, duration, order_index) 
                VALUES (:melody_id, :chord, :type, :duration, :order_index)";
        $stmt = $pdo->prepare($sql);

        foreach ($chords as $index => $chord) {
            $stmt->execute([
                'melody_id' => $melodyId,
                'chord' => isset($chord['chord']) ? $chord['chord'] : -1,
                'type' => isset($chord['type']) ? $chord['type'] : 0,
                'duration' => isset($chord['duration']) ? $chord['duration'] : 1,
                'order_index' => $index
            ]);
        }

        $pdo->commit();
    } catch (Exception $e) {
        $pdo->rollBack();
        throw $e;
    }
}

function getUserMelodies($userId)
{
    global $pdo;

    $sql = "SELECT id, title FROM melodies WHERE user_id = :user_id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['user_id' => $userId]);
    $melodies = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($melodies as &$melody) {
        $melody['chords'] = getMelodyChords($melody['id']);
    }

    return $melodies;
}

function getMelodyChords($melodyId)
{
    global $pdo;

    $sql = "SELECT chord, type, duration 
            FROM chords 
            WHERE melody_id = :melody_id 
            ORDER BY order_index ASC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['melody_id' => $melodyId]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}