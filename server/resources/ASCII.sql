-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jan 27, 2025 at 04:10 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ASCII`
--

-- --------------------------------------------------------

--
-- Table structure for table `chords`
--

CREATE TABLE `chords` (
  `id` int(11) NOT NULL,
  `melody_id` int(11) NOT NULL,
  `chord` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  `duration` float NOT NULL,
  `order_index` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chords`
--

INSERT INTO `chords` (`id`, `melody_id`, `chord`, `type`, `duration`, `order_index`) VALUES
(1, 1, 1, 0, 1.5, 0),
(2, 1, 2, 1, 2, 1),
(3, 1, 3, 0, 1.2, 2);

-- --------------------------------------------------------

--
-- Table structure for table `melodies`
--

CREATE TABLE `melodies` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `melodies`
--

INSERT INTO `melodies` (`id`, `user_id`, `title`, `created_at`) VALUES
(1, 1, 'My First Melody', '2025-01-27 14:59:48');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `created_at`) VALUES
(1, 'john_doe', '$2y$10$cJ9iZ03iULAhRWGAKXjcAeQsGGJBsIn0s8jnkP1BB3CInsNipB0om', '2025-01-27 14:22:15'),
(3, 'john_doe2', '$2y$10$nqN3WKcUwGlat5jNxBAchOabawAqsYOcsbejMqfAUCKAhfKRfz/du', '2025-01-27 14:24:41'),
(4, 'john_doe3', '$2y$10$thxDKcF8iSea5W0mRwmRze5yyshrs2LaNkRymKd9rJxtqieZp02le', '2025-01-27 14:28:57');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chords`
--
ALTER TABLE `chords`
  ADD PRIMARY KEY (`id`),
  ADD KEY `melody_id` (`melody_id`);

--
-- Indexes for table `melodies`
--
ALTER TABLE `melodies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chords`
--
ALTER TABLE `chords`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `melodies`
--
ALTER TABLE `melodies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chords`
--
ALTER TABLE `chords`
  ADD CONSTRAINT `chords_ibfk_1` FOREIGN KEY (`melody_id`) REFERENCES `melodies` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `melodies`
--
ALTER TABLE `melodies`
  ADD CONSTRAINT `melodies_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
