#DROP DATABASE IF EXISTS dig_doc;
CREATE DATABASE IF NOT EXISTS dig_doc;
USE dig_doc; 

# tables 
CREATE TABLE IF NOT EXISTS `clinicians` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL, 
  `image` varchar(255) NOT NULL,
  `email` varchar(30) NOT NULL,
  `active` boolean DEFAULT 1,
  `admin` boolean DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `modified_at` TIMESTAMP NULL, 
  `configuration` varchar(100) DEFAULT 'ivamem2',

  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;


CREATE TABLE IF NOT EXISTS `participants` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL, 
  `male` boolean DEFAULT 1, 
  `diagnosis` varchar(255) DEFAULT '',
  `comment` varchar(1024) DEFAULT '',
  `user_name` varchar(30) NOT NULL,
  `password` varchar(512) NOT NULL,
  `email` varchar(30) NOT NULL,
  `active` boolean DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `modified_at` TIMESTAMP NULL,
  `dob` DATE NULL,
  `auto_link` varchar(255) DEFAULT '',
  `configuration` varchar(100) DEFAULT 'ivamem2',

  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `conversations` ( 
  `id` varchar(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `last_question` varchar(255) DEFAULT '', 
  `last_modified_at` TIMESTAMP NULL, 
  `configuration` varchar(100) DEFAULT 'ivamem2',

  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;

# indexes  
CREATE INDEX  idx_clinicians_first_name ON clinicians(first_name);
CREATE INDEX  idx_clinicians_last_name ON clinicians(last_name);
CREATE INDEX  idx_clinicians_email ON clinicians(email); 
CREATE INDEX  idx_clinicians_active ON clinicians(active);
CREATE INDEX  idx_clinicians_admin ON clinicians(admin);

CREATE INDEX  idx_participants_user_name ON participants(user_name); 
CREATE INDEX  idx_participants_first_name ON participants(first_name);
CREATE INDEX  idx_participants_last_name ON participants(last_name);
CREATE INDEX  idx_participants_dob ON participants(dob); 
CREATE INDEX  idx_participants_male ON participants(male); 
CREATE INDEX  idx_participants_email ON participants(email);
CREATE INDEX  idx_participants_active ON participants(active); 

CREATE INDEX  idx_conversations_participant_id ON conversations(participant_id); 
CREATE INDEX  idx_conversations_created_at ON conversations(created_at); 
CREATE INDEX  idx_conversations_last_question ON conversations(last_question); 
# 8/8/2019
CREATE INDEX  idx_conversations_admin ON conversations(admin);
CREATE INDEX  idx_conversations_active ON conversations(active);