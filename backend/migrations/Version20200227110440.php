<?php

declare(strict_types=1);

namespace WWR\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200227110440 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('CREATE TABLE "training_data_validation" (user_uuid UUID NOT NULL, training_data_uuid UUID NOT NULL, validated BOOLEAN NOT NULL, created TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(user_uuid, training_data_uuid))');
        $this->addSql('CREATE INDEX IDX_6CCED88CABFE1C6F ON "training_data_validation" (user_uuid)');
        $this->addSql('CREATE INDEX IDX_6CCED88C4BCF8B0 ON "training_data_validation" (training_data_uuid)');
        $this->addSql('COMMENT ON COLUMN "training_data_validation".user_uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN "training_data_validation".training_data_uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('ALTER TABLE "training_data_validation" ADD CONSTRAINT FK_6CCED88CABFE1C6F FOREIGN KEY (user_uuid) REFERENCES "user" (uuid) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE "training_data_validation" ADD CONSTRAINT FK_6CCED88C4BCF8B0 FOREIGN KEY (training_data_uuid) REFERENCES "training_data" (uuid) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE training_data DROP is_validated');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP TABLE "training_data_validation"');
        $this->addSql('ALTER TABLE "training_data" ADD is_validated BOOLEAN DEFAULT \'false\' NOT NULL');
    }
}
