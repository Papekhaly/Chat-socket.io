-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 03, 2018 at 03:27 AM
-- Server version: 5.6.34-log
-- PHP Version: 7.1.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `chat_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `messages` text NOT NULL,
  `username` varchar(50) NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `messages`, `username`, `date`) VALUES
(105, 'salut', 'admin', '0000-00-00'),
(106, 'salut', 'admin', '0000-00-00'),
(107, 'saut', 'user', '0000-00-00'),
(108, 'salut', 'admin', '0000-00-00'),
(109, 'hey', 'admin', '0000-00-00'),
(110, 'salut admin', 'user', '0000-00-00'),
(111, 'net', 'admin', '0000-00-00'),
(112, 'salut', 'admin', '0000-00-00'),
(113, 'hey', 'admin', '0000-00-00'),
(114, 'salut', 'admin', '0000-00-00'),
(115, 'hey', 'admin', '0000-00-00'),
(116, 'salut', 'admin', '0000-00-00'),
(117, 'hey guys', 'biggie', '0000-00-00'),
(118, 'hey', 'biggie', '0000-00-00'),
(119, 'yo', 'pac', '0000-00-00'),
(120, 'yes', 'biggie', '0000-00-00'),
(121, 'yup', 'pac', '0000-00-00'),
(122, 'yo', 'pac', '0000-00-00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=123;COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
