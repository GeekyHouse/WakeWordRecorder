<?php

declare(strict_types=1);

namespace WWR\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;
use Ramsey\Uuid\Uuid;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200127154539 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('CREATE TABLE Provider (uuid UUID NOT NULL, label VARCHAR(255) NOT NULL, PRIMARY KEY(uuid))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_6BB211CAEA750E8 ON Provider (label)');
        $this->addSql('COMMENT ON COLUMN Provider.uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('INSERT INTO Provider (uuid, label) VALUES
            (\''.Uuid::uuid4().'\', \'google\'),
            (\''.Uuid::uuid4().'\', \'facebook\'),
            (\''.Uuid::uuid4().'\', \'github\')');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'postgresql', 'Migration can only be executed safely on \'postgresql\'.');

        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP TABLE Provider');
    }
}
