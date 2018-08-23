-- Last modification: 23-08-2018 15:24:44
-- MySQL dump 10.13  Distrib 5.7.23, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: itools
-- ------------------------------------------------------
-- Server version	5.7.23-0ubuntu0.16.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `customer`
--
USE `itools`;

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES ('01060257246','Flavio Jessica Leme','flávio.jéssica@leme.com','0'),('10867963654','Penélope Florinda Balsemão','penélope.florinda@balsemão.com','0'),('11441452281','Cândido Brígida Sobral','cândido.brígida@sobral.com','0'),('13547576610','Adelina Roque Porto','adelina.roque@porto.com','0'),('14486378300','Capitolino Blasco Lousado','capitolino.blasco@lousado.com','0'),('15653897868','Aniana Rosário Gama','aniana.rosário@gama.com','0'),('32843172284','Napoleão Roquita Gonçalves','napoleão.roquita@gonçalves.com','0'),('35223685504','Judite Luana Curvelo','judite.luana@curvelo.com','0'),('51377883175','Rodolfo Carolina Montenegro','rodolfo.carolina@montenegro.com','0'),('52941472460','Claudemira Adolfo Araújo','claudemira.adolfo@araújo.com','0'),('58048238411','Gláucio Teodora Vasconcelos','gláucio.teodora@vasconcelos.com','0'),('58137681302','Beatriz Angelina Varão','beatriz.angelina@varão.com','0'),('61249443326','Manuela Fiona Letras','manuela.fiona@letras.com','0'),('65960748622','Lília Jacinto Pêcego','lília.jacinto@pêcego.com','0'),('71247768058','Paulo Levi Cedro','paulo.levi@cedro.com','0'),('74236615207','Lourenço Eurico Vilanova','lourenço.eurico@vilanova.com','0'),('75017044221','Fausto Girão Alcântara','fausto.girão@alcântara.com','0'),('78099088808','Brites Eurico Grangeia','brites.eurico@grangeia.com','0'),('79244387425','Clotilde Anacleto Talhão','clotilde.anacleto@talhão.com','0'),('84421825514','Martinho Zilda Pereira','martinho.zilda@pereira.com','0'),('85999655730','Inácio Uriel Guedes','inácio.uriel@guedes.com','0'),('86578824502','Capitolina Bruna Lustosa','capitolina.bruna@lustosa.com','0'),('88257602485','Priscila Palmiro Goulart','priscila.palmiro@goulart.com','0'),('93511035287','Adelino Celestino Vargas','adelino.celestino@vargas.com','0'),('95197820101','Jadir Iolanda Quinteiro','jadir.iolanda@quinteiro.com','0');
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `phone`
--

LOCK TABLES `phone` WRITE;
/*!40000 ALTER TABLE `phone` DISABLE KEYS */;
INSERT INTO `phone` VALUES ('10867963654','53979749151','mobile'),('11441452281','29995032815','fax'),('13547576610','48982112701','mobile'),('14486378300','19996924648','mobile'),('15653897868','79979304575','home'),('32843172284','29988706092','home'),('35223685504','85981294328','mobile'),('51377883175','46975464925','mobile'),('52941472460','46999788016','home'),('58048238411','45982843825','work'),('58137681302','41997063764','mobile'),('61249443326','84997080523','work'),('65960748622','79998895072','home'),('71247768058','51995451137','work'),('74236615207','35974083615','mobile'),('75017044221','90978977728','mobile'),('78099088808','78973076342','fax'),('79244387425','91982348387','work'),('84421825514','87988715892','home'),('85999655730','49982821454','mobile'),('86578824502','31988840968','home'),('88257602485','24978102349','mobile'),('93511035287','28979966854','home'),('95197820101','94989540688','fax');
/*!40000 ALTER TABLE `phone` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-08-23 15:20:40
