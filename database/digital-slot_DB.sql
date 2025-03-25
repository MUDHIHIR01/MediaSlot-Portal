-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 25, 2025 at 02:44 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `medialslot_portalDB`
--

-- --------------------------------------------------------

--
-- Table structure for table `ad_slots`
--

CREATE TABLE `ad_slots` (
  `ad_slot_id` int(10) UNSIGNED NOT NULL,
  `ad_type` varchar(255) NOT NULL,
  `ad_unit` varchar(255) NOT NULL,
  `dimensions` varchar(255) NOT NULL,
  `device` varchar(255) NOT NULL,
  `platform` varchar(255) NOT NULL,
  `rate` varchar(255) NOT NULL,
  `placement_type` varchar(255) NOT NULL,
  `rate_unit` varchar(255) NOT NULL,
  `duration_limit` varchar(255) DEFAULT NULL,
  `available` tinyint(1) NOT NULL DEFAULT 1,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ad_slots`
--

INSERT INTO `ad_slots` (`ad_slot_id`, `ad_type`, `ad_unit`, `dimensions`, `device`, `platform`, `rate`, `placement_type`, `rate_unit`, `duration_limit`, `available`, `image`, `created_at`, `updated_at`) VALUES
(6, 'Special Execution', 'unit', '56  *33', 'desktop', 'inst', '344555.00', 'placement type', 'cmd', '3', 1, 'https://res.cloudinary.com/depvc7n0v/image/upload/v1742902291/ad_slots/vrholksgfjqsmwanvj4o.png', '2025-03-25 08:31:32', '2025-03-25 08:31:32'),
(7, 'High-Impact', 'Leader Board', '734  *34', 'Desktop and mobile', 'Instagram', '344555.00', 'RON', 'CMD USD', '2', 1, 'https://res.cloudinary.com/depvc7n0v/image/upload/v1742902362/ad_slots/vzwsvfhoqwhkvu4v13j3.png', '2025-03-25 08:32:43', '2025-03-25 08:32:43'),
(8, 'Special Execution', 'Leader Board', '734  *343', 'Desktop and mobile', 'Instagram', '12255.00', 'MWI MIZIZ', 'TZS per day', '1', 1, 'https://res.cloudinary.com/depvc7n0v/image/upload/v1742902962/ad_slots/d0p9vbodnidnrtykuf8n.png', '2025-03-25 08:42:42', '2025-03-25 08:42:42'),
(9, 'Standard Banner', 'RoadBlock', '35959* 123', 'Desktop only', 'Whaatsapp', '400000.00', 'RON', 'cpm usd', '1', 1, 'https://res.cloudinary.com/depvc7n0v/image/upload/v1742903125/ad_slots/b4kfw7wcnbzqiqoxioei.png', '2025-03-25 08:45:26', '2025-03-25 08:45:26'),
(10, 'High-Impact', 'Leader Board', '35959* 123', 'Desktop and mobile', 'Instagram', '12000.00', 'RON', 'CMD USD', '1', 1, 'https://res.cloudinary.com/depvc7n0v/image/upload/v1742903155/ad_slots/gykihdcpgxabw76qi6bk.png', '2025-03-25 08:45:56', '2025-03-25 08:45:56'),
(11, 'Special Execution', 'Leader Board', '734  *34', 'Desktop only', 'Whaatsapp', '1223355.00', 'MWI MIZIZ', 'CMD USD', '3', 1, 'https://res.cloudinary.com/depvc7n0v/image/upload/v1742903185/ad_slots/jtu0uowirxyse735ry5m.png', '2025-03-25 08:46:26', '2025-03-25 08:46:26'),
(12, 'High-Impact', 'Leader Board', '734  *34', 'Desktop and mobile', 'Whaatsapp', '33455.00', 'RON', 'TZS per day', '2', 1, 'https://res.cloudinary.com/depvc7n0v/image/upload/v1742903215/ad_slots/whu86hhqqvnegnujqe8g.png', '2025-03-25 08:46:56', '2025-03-25 08:46:56'),
(14, 'High-Impact', 'Leader Board', '734  *534', 'Desktop and mobile', 'Whaatsapp', '12000.00', 'RON', 'CMD USD', '1', 1, 'https://res.cloudinary.com/depvc7n0v/image/upload/v1742903361/ad_slots/orj9wbubwl6mo1y6fwgp.png', '2025-03-25 08:49:22', '2025-03-25 08:49:22');

-- --------------------------------------------------------

--
-- Table structure for table `audit_trail`
--

CREATE TABLE `audit_trail` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `email` varchar(255) NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `action` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `audit_trail`
--

INSERT INTO `audit_trail` (`id`, `user_id`, `email`, `role_id`, `action`, `created_at`, `updated_at`) VALUES
(1, 2, 'normaluser123@gmail.com', 2, 'login', '2025-03-24 17:46:27', '2025-03-24 17:46:27'),
(2, 2, 'normaluser123@gmail.com', 2, 'login', '2025-03-24 17:46:42', '2025-03-24 17:46:42'),
(3, 2, 'normaluser123@gmail.com', 2, 'login', '2025-03-24 17:48:03', '2025-03-24 17:48:03'),
(4, 2, 'normaluser123@gmail.com', 2, 'login', '2025-03-24 17:48:22', '2025-03-24 17:48:22'),
(5, 2, 'normaluser123@gmail.com', 2, 'login', '2025-03-24 18:59:26', '2025-03-24 18:59:26'),
(6, 2, 'normaluser123@gmail.com', 2, 'login', '2025-03-24 18:59:37', '2025-03-24 18:59:37'),
(7, 3, 'user01@gmail.com', 2, 'login', '2025-03-24 20:13:06', '2025-03-24 20:13:06'),
(8, 8, 'normaluser01@gmail.com', 2, 'login', '2025-03-24 20:27:46', '2025-03-24 20:27:46'),
(9, 8, 'normaluser01@gmail.com', 2, 'login', '2025-03-24 20:49:02', '2025-03-24 20:49:02'),
(10, 8, 'normaluser01@gmail.com', 2, 'login', '2025-03-24 20:53:43', '2025-03-24 20:53:43'),
(11, 8, 'normaluser01@gmail.com', 2, 'login', '2025-03-24 21:04:59', '2025-03-24 21:04:59'),
(12, 8, 'normaluser01@gmail.com', 2, 'login', '2025-03-24 21:06:47', '2025-03-24 21:06:47'),
(13, 8, 'normaluser01@gmail.com', 2, 'login', '2025-03-24 21:12:39', '2025-03-24 21:12:39'),
(14, 8, 'normaluser01@gmail.com', 2, 'login', '2025-03-24 21:39:46', '2025-03-24 21:39:46'),
(15, 8, 'normaluser01@gmail.com', 2, 'login', '2025-03-24 21:48:23', '2025-03-24 21:48:23'),
(16, 8, 'normaluser01@gmail.com', 2, 'login', '2025-03-24 21:49:37', '2025-03-24 21:49:37'),
(17, 8, 'normaluser01@gmail.com', 2, 'login', '2025-03-24 21:50:04', '2025-03-24 21:50:04'),
(18, 8, 'normaluser01@gmail.com', 2, 'login', '2025-03-25 02:42:10', '2025-03-25 02:42:10'),
(19, 2, 'normaluser123@gmail.com', 2, 'login', '2025-03-25 02:45:57', '2025-03-25 02:45:57'),
(20, 2, 'normaluser123@gmail.com', 2, 'login', '2025-03-25 02:46:11', '2025-03-25 02:46:11'),
(21, 2, 'normaluser123@gmail.com', 2, 'login', '2025-03-25 02:46:50', '2025-03-25 02:46:50'),
(22, 2, 'normaluser123@gmail.com', 2, 'login', '2025-03-25 02:47:05', '2025-03-25 02:47:05'),
(23, 2, 'normaluser123@gmail.com', 2, 'login', '2025-03-25 02:47:34', '2025-03-25 02:47:34'),
(24, 2, 'normaluser123@gmail.com', 2, 'login', '2025-03-25 02:47:50', '2025-03-25 02:47:50'),
(25, 8, 'normaluser01@gmail.com', 2, 'login', '2025-03-25 02:49:30', '2025-03-25 02:49:30'),
(26, 8, 'normaluser01@gmail.com', 2, 'login', '2025-03-25 02:49:45', '2025-03-25 02:49:45'),
(27, 8, 'normaluser01@gmail.com', 2, 'login', '2025-03-25 02:57:54', '2025-03-25 02:57:54'),
(28, 8, 'normaluser01@gmail.com', 2, 'login', '2025-03-25 02:58:14', '2025-03-25 02:58:14'),
(29, 8, 'normaluser01@gmail.com', 2, 'login', '2025-03-25 03:04:43', '2025-03-25 03:04:43'),
(30, 8, 'normaluser01@gmail.com', 2, 'login', '2025-03-25 03:06:22', '2025-03-25 03:06:22'),
(31, 8, 'normaluser01@gmail.com', 2, 'login', '2025-03-25 03:06:37', '2025-03-25 03:06:37'),
(32, 8, 'normaluser01@gmail.com', 2, 'login', '2025-03-25 03:25:43', '2025-03-25 03:25:43'),
(33, 2, 'normaluser123@gmail.com', 2, 'login', '2025-03-25 03:26:32', '2025-03-25 03:26:32'),
(34, 3, 'user01@gmail.com', 2, 'login', '2025-03-25 03:27:26', '2025-03-25 03:27:26'),
(35, 3, 'user01@gmail.com', 2, 'login', '2025-03-25 03:28:30', '2025-03-25 03:28:30'),
(36, 8, 'normaluser01@gmail.com', 2, 'login', '2025-03-25 03:32:43', '2025-03-25 03:32:43'),
(37, 8, 'normaluser01@gmail.com', 2, 'login', '2025-03-25 03:32:58', '2025-03-25 03:32:58'),
(38, 8, 'normaluser01@gmail.com', 2, 'login', '2025-03-25 03:39:50', '2025-03-25 03:39:50'),
(39, 8, 'normaluser01@gmail.com', 2, 'login', '2025-03-25 03:40:10', '2025-03-25 03:40:10'),
(40, 3, 'user01@gmail.com', 2, 'login', '2025-03-25 04:08:53', '2025-03-25 04:08:53'),
(41, 1, 'nyemamudhihir@gmail.com', 1, 'login', '2025-03-25 05:01:20', '2025-03-25 05:01:20'),
(42, 8, 'normaluser01@gmail.com', 2, 'login', '2025-03-25 05:56:08', '2025-03-25 05:56:08'),
(43, 8, 'normaluser01@gmail.com', 2, 'login', '2025-03-25 05:56:22', '2025-03-25 05:56:22'),
(44, 1, 'nyemamudhihir@gmail.com', 1, 'login', '2025-03-25 07:37:13', '2025-03-25 07:37:13'),
(45, 1, 'nyemamudhihir@gmail.com', 1, 'login', '2025-03-25 08:16:36', '2025-03-25 08:16:36'),
(46, 1, 'nyemamudhihir@gmail.com', 1, 'login', '2025-03-25 08:41:24', '2025-03-25 08:41:24'),
(47, 1, 'nyemamudhihir@gmail.com', 1, 'login', '2025-03-25 08:48:39', '2025-03-25 08:48:39'),
(48, 1, 'nyemamudhihir@gmail.com', 1, 'login', '2025-03-25 08:50:05', '2025-03-25 08:50:05'),
(49, 1, 'nyemamudhihir@gmail.com', 1, 'login', '2025-03-25 08:56:09', '2025-03-25 08:56:09'),
(50, 1, 'nyemamudhihir@gmail.com', 1, 'login', '2025-03-25 09:07:43', '2025-03-25 09:07:43'),
(51, 1, 'nyemamudhihir@gmail.com', 1, 'login', '2025-03-25 09:08:51', '2025-03-25 09:08:51'),
(52, 8, 'normaluser01@gmail.com', 2, 'login', '2025-03-25 09:09:19', '2025-03-25 09:09:19'),
(53, 8, 'normaluser01@gmail.com', 2, 'login', '2025-03-25 09:16:25', '2025-03-25 09:16:25'),
(54, 8, 'normaluser01@gmail.com', 2, 'login', '2025-03-25 09:19:21', '2025-03-25 09:19:21'),
(55, 8, 'normaluser01@gmail.com', 2, 'login', '2025-03-25 09:20:34', '2025-03-25 09:20:34'),
(56, 8, 'normaluser01@gmail.com', 2, 'login', '2025-03-25 09:23:40', '2025-03-25 09:23:40'),
(57, 8, 'normaluser01@gmail.com', 2, 'login', '2025-03-25 09:23:55', '2025-03-25 09:23:55'),
(58, 1, 'nyemamudhihir@gmail.com', 1, 'login', '2025-03-25 09:29:13', '2025-03-25 09:29:13'),
(59, 8, 'normaluser01@gmail.com', 2, 'login', '2025-03-25 09:31:37', '2025-03-25 09:31:37'),
(60, 1, 'nyemamudhihir@gmail.com', 1, 'login', '2025-03-25 09:32:05', '2025-03-25 09:32:05'),
(61, 1, 'nyemamudhihir@gmail.com', 1, 'login', '2025-03-25 09:39:43', '2025-03-25 09:39:43'),
(62, 1, 'nyemamudhihir@gmail.com', 1, 'login', '2025-03-25 09:41:23', '2025-03-25 09:41:23'),
(63, 1, 'nyemamudhihir@gmail.com', 1, 'login', '2025-03-25 09:43:15', '2025-03-25 09:43:15'),
(64, 8, 'normaluser01@gmail.com', 2, 'login', '2025-03-25 09:55:59', '2025-03-25 09:55:59'),
(65, 8, 'normaluser01@gmail.com', 2, 'login', '2025-03-25 09:56:15', '2025-03-25 09:56:15'),
(66, 8, 'normaluser01@gmail.com', 2, 'login', '2025-03-25 09:58:04', '2025-03-25 09:58:04'),
(67, 8, 'normaluser01@gmail.com', 2, 'login', '2025-03-25 09:58:18', '2025-03-25 09:58:18'),
(68, 8, 'normaluser01@gmail.com', 2, 'login', '2025-03-25 09:58:39', '2025-03-25 09:58:39'),
(69, 8, 'normaluser01@gmail.com', 2, 'login', '2025-03-25 09:58:56', '2025-03-25 09:58:56'),
(70, 1, 'nyemamudhihir@gmail.com', 1, 'login', '2025-03-25 10:22:01', '2025-03-25 10:22:01'),
(71, 8, 'normaluser01@gmail.com', 2, 'login', '2025-03-25 10:22:26', '2025-03-25 10:22:26'),
(72, 1, 'nyemamudhihir@gmail.com', 1, 'login', '2025-03-25 10:23:14', '2025-03-25 10:23:14'),
(73, 8, 'normaluser01@gmail.com', 2, 'login', '2025-03-25 10:24:58', '2025-03-25 10:24:58'),
(74, 1, 'nyemamudhihir@gmail.com', 1, 'login', '2025-03-25 10:28:50', '2025-03-25 10:28:50'),
(75, 1, 'nyemamudhihir@gmail.com', 1, 'login', '2025-03-25 10:29:02', '2025-03-25 10:29:02'),
(76, 1, 'nyemamudhihir@gmail.com', 1, 'login', '2025-03-25 10:31:54', '2025-03-25 10:31:54'),
(77, 8, 'normaluser01@gmail.com', 2, 'login', '2025-03-25 10:32:13', '2025-03-25 10:32:13'),
(78, 8, 'normaluser01@gmail.com', 2, 'login', '2025-03-25 10:36:49', '2025-03-25 10:36:49'),
(79, 8, 'normaluser01@gmail.com', 2, 'login', '2025-03-25 10:36:59', '2025-03-25 10:36:59');

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `booking_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `ad_slot_id` int(10) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `total_cost` decimal(15,2) NOT NULL,
  `duration_type` varchar(255) NOT NULL,
  `duration_value` int(11) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`booking_id`, `user_id`, `ad_slot_id`, `quantity`, `total_cost`, `duration_type`, `duration_value`, `status`, `created_at`, `updated_at`) VALUES
(47, 8, 14, 2, 24000.00, 'hours', 1, 'confirmed', '2025-03-25 10:22:39', '2025-03-25 10:23:32'),
(48, 8, 12, 3, 100365.00, 'hours', 1, 'confirmed', '2025-03-25 10:22:39', '2025-03-25 10:23:43'),
(49, 8, 11, 2, 2446710.00, 'hours', 1, 'confirmed', '2025-03-25 10:22:39', '2025-03-25 10:23:59'),
(50, 8, 14, 2, 24000.00, 'hours', 1, 'pending', '2025-03-25 10:32:54', '2025-03-25 10:32:54'),
(51, 8, 12, 3, 100365.00, 'hours', 1, 'pending', '2025-03-25 10:32:54', '2025-03-25 10:32:54');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `invoice_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `booking_id` int(10) UNSIGNED NOT NULL,
  `total_amount` decimal(15,2) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'unpaid',
  `invoice_number` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `invoices`
--

INSERT INTO `invoices` (`invoice_id`, `user_id`, `booking_id`, `total_amount`, `status`, `invoice_number`, `created_at`, `updated_at`) VALUES
(9, 8, 47, 2571075.00, 'unpaid', 'INV-1742908959', '2025-03-25 10:22:39', '2025-03-25 10:22:39'),
(10, 8, 50, 124365.00, 'unpaid', 'INV-1742909574', '2025-03-25 10:32:54', '2025-03-25 10:32:54');

-- --------------------------------------------------------

--
-- Table structure for table `logs`
--

CREATE TABLE `logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `level` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `context` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`context`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2014_10_12_100000_create_password_reset_tokens_table', 1),
(3, '2019_08_19_000000_create_failed_jobs_table', 1),
(4, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(5, '2024_08_27_112442_create_roles_table', 1),
(6, '2024_10_27_204027_create_password_resets_table', 1),
(7, '2024_10_29_191137_create_audit_trail_table', 1),
(8, '2024_12_19_210107_create_logs_table', 1),
(9, '2025_03_24_094800_create_ad_slots_table', 1),
(10, '2025_03_24_094824_create_bookings_table', 1),
(11, '2025_03_24_094846_create_invoices_table', 1),
(12, '2025_03_24_094853_create_payments_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `password_resets`
--

INSERT INTO `password_resets` (`id`, `email`, `token`, `expires_at`, `created_at`) VALUES
(1, 'nyemamudhihir@gmail.com', 'RGekjpwm8loWjPJMCM4b1piilYTfnrFvFqMY54sNegsfKLb021nYP58s7HPl', '2025-03-25 09:35:23', '2025-03-25 09:34:43'),
(2, 'nyemamudhihir@gmail.com', 'xASrWrVRkAQ8BffivEw2ReF1f2iUzrqYoj2hPgFXJc0SpsFvlTKocWfMqBIl', '2025-03-25 09:35:31', '2025-03-25 09:34:51'),
(3, 'nyemamudhihir@gmail.com', 'iFHHBkr0cvhcL3xrcR7OL1lzo9CxZXXwcjYGJYhelUln2kg7bI5CZVNTJKuF', '2025-03-25 09:35:45', '2025-03-25 09:35:05'),
(4, 'nyemamudhihir@gmail.com', 'CTKKqbckSy9LXZRk2wDh0dO3vZrXjYpMUQ4nKNHZrZ1M9MoYpkt5JBj63HXp', '2025-03-25 09:36:05', '2025-03-25 09:35:25'),
(5, 'nyemamudhihir@gmail.com', 'vNjewaSMwTs9VDCTwCYUYNrDLjETJG622M9gcVjm70KJ6gs7QXD65WaXGyOJ', '2025-03-25 09:38:36', '2025-03-25 09:37:56'),
(6, 'nyemamudhihir@gmail.com', '412QtaG7BvuGraiIoJAxeYBmzZSeWPXsgWCzCivIbN8YQS2KAbUG76dBqXfi', '2025-03-25 09:38:49', '2025-03-25 09:38:09');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `payment_id` int(10) UNSIGNED NOT NULL,
  `invoice_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `amount_paid` decimal(8,2) NOT NULL,
  `ref_number` varchar(255) DEFAULT NULL,
  `receipt_picture` varchar(255) DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(77, 'App\\Models\\User', 8, 'authToken', '7e677620358714ffdccaa97987172a34f16baee0f4c8cb6769b33ea54f1bb2c4', '[]', '2025-03-25 10:44:42', '2025-03-25 18:32:13', '2025-03-25 10:32:13', '2025-03-25 10:44:42'),
(78, 'App\\Models\\User', 8, 'authToken', 'd04c5481a09fd5ecf06d916c91e811d973792cd7e815d3117d47be19c2afbffd', '[]', '2025-03-25 10:37:04', '2025-03-25 18:36:49', '2025-03-25 10:36:49', '2025-03-25 10:37:04'),
(79, 'App\\Models\\User', 8, 'authToken', '1f59b8ce6746d8096f589a7935dd8a0b4252ddb0e125a7fbd93ff00e0747bb45', '[]', NULL, '2025-03-25 18:36:59', '2025-03-25 10:36:59', '2025-03-25 10:36:59');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `role_id` int(10) UNSIGNED NOT NULL,
  `category` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`role_id`, `category`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Admin', 'system', NULL, NULL),
(2, 'User', 'system user', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `role_id` int(11) NOT NULL DEFAULT 2,
  `status` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `name`, `role_id`, `status`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Admin User', 1, 'is_active', 'nyemamudhihir@gmail.com', NULL, '$2y$12$UFFPGZLP2Vjtku/KhDjzJe1Xr9bMNRWihdzVyVT.LLYplJTlvPlty', NULL, '2025-03-24 17:43:38', '2025-03-24 17:43:38'),
(2, 'Normal User', 2, 'is_active', 'normaluser123@gmail.com', NULL, '$2y$12$9cI85QDcWEMVqxZ6rsBvaeWTeryr00aQF/yrBDZU7QvTW6HiRDEce', NULL, '2025-03-24 17:43:57', '2025-03-24 17:43:57'),
(8, 'Normal user', 2, 'is_active', 'normaluser01@gmail.com', NULL, '$2y$12$hmaS3UaD0K.e9UNe69ZsA.CApF.br0J.Vc//RxMzwt9znIGerohN6', NULL, '2025-03-24 20:27:34', '2025-03-24 20:27:34');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ad_slots`
--
ALTER TABLE `ad_slots`
  ADD PRIMARY KEY (`ad_slot_id`);

--
-- Indexes for table `audit_trail`
--
ALTER TABLE `audit_trail`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`booking_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`invoice_id`),
  ADD UNIQUE KEY `invoices_invoice_number_unique` (`invoice_number`);

--
-- Indexes for table `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `password_resets_email_index` (`email`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_id`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ad_slots`
--
ALTER TABLE `ad_slots`
  MODIFY `ad_slot_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `audit_trail`
--
ALTER TABLE `audit_trail`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=80;

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `booking_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `invoice_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `logs`
--
ALTER TABLE `logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=80;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
