CREATE DATABASE  IF NOT EXISTS `dreamingflowers` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `dreamingflowers`;
-- MySQL dump 10.13  Distrib 8.0.44, for macos15 (arm64)
--
-- Host: 127.0.0.1    Database: dreamingflowers
-- ------------------------------------------------------
-- Server version	8.4.7

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ciudades`
--

DROP TABLE IF EXISTS `ciudades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ciudades` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `estado` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ciudades`
--

LOCK TABLES `ciudades` WRITE;
/*!40000 ALTER TABLE `ciudades` DISABLE KEYS */;
INSERT INTO `ciudades` VALUES (1,'Ciudad de México','CDMX'),(2,'Playa del Carmen','Quintana Roo'),(3,'Guadalajara','Jalisco'),(4,'Monterrey','Nuevo León'),(5,'Cancún','Quintana Roo'),(6,'Mérida','Yucatán'),(7,'Querétaro','Querétaro'),(8,'Puebla','Puebla'),(9,'Tijuana','Baja California'),(10,'Mérida','Yucatán');
/*!40000 ALTER TABLE `ciudades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `florerias`
--

DROP TABLE IF EXISTS `florerias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `florerias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `descripcion` text,
  `logo` varchar(255) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `horarios` varchar(20) DEFAULT NULL,
  `telefono` varchar(12) DEFAULT NULL,
  `correo_electronico` varchar(150) DEFAULT NULL,
  `estatus` tinyint(1) DEFAULT '1',
  `id_ciudad` int NOT NULL,
  `id_usuario` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `florerias`
--

LOCK TABLES `florerias` WRITE;
/*!40000 ALTER TABLE `florerias` DISABLE KEYS */;
INSERT INTO `florerias` VALUES (1,'Azap Flores','Diseños florales modernos y minimalistas. Especialistas en entregas rápidas y estética limpia.','logo_1764912640486-326417942.png','Av. Constituyentes 123, CDMX','Lun-Dom 8:00-20:00','55 1234 5678','contacto@azapflores.com',1,1,7),(2,'Verbena Flores','Arreglos de lujo con flores de temporada. Estilo elegante y sofisticado para ocasiones especiales.','logo_1764912258447-271685460.jpeg','Colonia Roma Norte, CDMX','Lun-Sab 9:00-19:00','55 9876 5432','hola@verbenaflores.com',1,1,7),(3,'Mercado de Jamaica Online','La frescura del mercado más famoso de México directo a tu casa. Precios accesibles y gran variedad.','logo_1764912691632-247287394.png','Congreso de la Unión, CDMX','24 Horas','55 5555 4444','pedidos@jamaicaonline.mx',1,1,7),(4,'Florería Mexicanísimo','Florería tradicional con servicio express. Arreglos para toda ocasión y eventos.','logo_1764912732977-251764795.png','Calle Bolivar 45, Centro Histórico, CDMX','Lun-Sab 9:00-18:00','55 3231 0800','ventas@mexicanisimo.com',1,1,7),(5,'Florería Iris','Envíos gratis dentro de Playa del Carmen. Arreglos tropicales y clásicos.','logo_1764912761189-49036199.webp','Av. 30 Norte, Centro, Playa del Carmen','Lun-Sab 9:00-21:00','984 231 2567','contacto@floreriairis.com',1,2,7),(6,'Cherry Blossom','Boutique floral con diseños exclusivos. Decoración de eventos y bodas en la Riviera Maya.','logo_1764912824625-931364254.jpeg','Real Ibiza Privada Martinet 307, Playa del Carmen','Lun-Vie 10:00-18:00','984 157 8169','info@cherryblossom.com',1,2,7),(7,'Florería Riviera','Especialistas en ramos de rosas y orquídeas. Servicio a hoteles y domicilios.','logo_1764912895970-763636962.png','Carretera Federal, Playa del Carmen','Lun-Dom 8:00-22:00','984 803 1234','ventas@floreriariviera.com',1,2,7),(8,'Flores PAROLA','Envío de flores a domicilio gratis en Guadalajara y Zapopan. Calidad garantizada.','logo_1764913048974-863248103.png','Av. Vallarta 2440, Guadalajara, Jal.','Lun-Sab 9:00-20:00','33 1580 9902','ventas@floresparola.com',1,3,7),(9,'La Buchifresa','Arreglos de rosas gigantes y diseños de lujo tipo buchón. Impactantes y exclusivos.','logo_1764913094134-550381848.jpeg','Zona Andares, Guadalajara, Jal.','Lun-Sab 10:00-19:00','33 2921 4644','pedidos@labuchifresa.com',1,3,7),(10,'Florería Guadalajara','Tradición tapatía con arreglos clásicos y elegantes. Servicio confiable.','logo_1764913124928-776554178.jpg','Av. México 123, Guadalajara, Jal.','Lun-Sab 9:00-18:00','33 3615 8899','contacto@floreriagdl.com',1,3,7),(11,'Florería Lizette','Gran variedad de arreglos florales y regalos. Servicio a todo Monterrey.','logo_1764913238139-335085168.jpeg','Av. Monterrey 100, Monterrey, NL','Lun-Dom 9:00-21:00','81 1918 7398','pedidos@florerializette.mx',1,4,7),(12,'Florería Encanto','Más de 80 años de tradición en Monterrey. Calidad y frescura garantizada.','logo_1764913263815-346297478.png','Av. Simón Bolívar, Monterrey, NL','Lun-Sab 8:00-20:00','81 8333 3204','contacto@floreriaencanto.com',1,4,7),(13,'Florería La Silla','Diseños florales para eventos y ocasiones especiales. Elegancia regia.','logo_1764913294950-538272919.png','Col. Obispado, Monterrey, NL','Lun-Vie 9:00-18:00','81 8344 5566','ventas@lasilla.com',1,4,7),(14,'Florería Tulipania','Arreglos florales exclusivos y decoración de eventos.','logo_1764913345160-436597794.png','Plaza Linda Local 1 Av. Huayacan Sm. 313, Cancún','Lun-Sab 9:00-20:00','998 267 8273','info@tulipania.com',1,5,7),(15,'Le Bloom Room','Concepto de detalles con arreglos florales a domicilio conservando el romanticismo.','logo_1764913378114-428336685.png','Av. Bonampak, Cancún','Lun-Sab 10:00-19:00','998 123 4567','hola@lebloomroom.com',1,5,7),(16,'Florería Nico Huaycán','Ramos, plantas y regalos. Entrega rápida en zona hotelera y centro.','logo_1764913404720-625500278.jpeg','Av. Huayacán, Cancún','Lun-Dom 8:00-22:00','998 888 7777','ventas@florerianico.com',1,5,7),(17,'Todo Florece','Florería y diseño de bodas en Cancún y Riviera Maya.','logo_1764913432154-246072525.jpeg','Av. Kohunlich 266, Cancún','Lun-Vie 9:00-18:00','998 200 3344','bodas@todoflorece.net',1,5,7),(18,'Florería Mérida','Flores frescas y follajes exóticos en la ciudad blanca.','logo_1764913499818-203252633.jpeg','Paseo de Montejo, Mérida','Lun-Sab 9:00-20:00','999 923 4500','hola@floreriamerida.com',1,6,7);
/*!40000 ALTER TABLE `florerias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `correo_electronico` varchar(100) NOT NULL,
  `contrasenia` varchar(255) NOT NULL,
  `rol` enum('admin','user') DEFAULT 'user',
  `estatus` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Hector Partido','hector@example.com','$2b$10$zQMtLMbIKC2CoTGqkwh3vempDZLlqqAVBaaortW07jY1sz7jXsZ96','user',1),(2,'Hector Partido','partydo@hotmail.com','$2b$10$s4zt1YOCdM0eDfOv1bcNcu4FQP2TkH1jZ0Oab62Ht/b2bxOrNHouy','user',1),(3,'Hector Partido','partydo@msn.com','$2b$10$PFbgPg8LY5Jamb9xCfm5oO93JVEHM7sGdnaqEn.R72D1kGGHTVaeO','user',1),(4,'Alexander Recaman','recaman@hotmail.com','$2b$10$CUHVYrwF824C5oRxKzl0hOwOnIZtLMy3jhKPsbKowdBwcDZeK00RC','user',1),(5,'Hector Admin','admin@hotmail.com','$2b$10$/sx5Fceq.7K3FiE63BX0HOf5JXU9DfF0K4YDv4td49taC5H.hNT6S','admin',1),(6,'Daniel Eduardo Rios Astudillo','admin@outlook.com','$2b$10$rYrdOQNR2dNAerz5tb6eeuWfrwz0Mtb/PgbTb0bjINuOQtMgN6qr2','admin',1),(7,'Gabriel Perez Torrez','gpt@hotmail.com','$2b$10$UrbfROiSTuJHmk5nac85x.mViLENLzLw38rLiUzvYisdW85REgG3W','admin',1),(8,'Yoli Quiñones','yoli@hotmail.com','$2b$10$9GtXCW.0i/mh3chrtr3WeepPhoL/hRRUsmbzItRhy3AFFHMvP5Jqy','user',1);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-05  1:45:55
