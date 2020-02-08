<?php
declare(strict_types=1);

namespace App\Domain\WakeWord;

use App\Domain\AbstractModel;
use DateTime;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation\{ExclusionPolicy, Expose, Groups};
use Ramsey\Uuid\UuidInterface;

/**
 * @ExclusionPolicy("all")
 * @ORM\Entity(repositoryClass="App\Domain\WakeWord\WakeWordRepository")
 * @ORM\Table(name="`wake_word`")
 * @ORM\HasLifecycleCallbacks
 */
class WakeWord extends AbstractModel
{
    /**
     * @var UuidInterface
     *
     * @Expose
     * @Groups({"short"})
     * @ORM\Id
     * @ORM\Column(type="uuid", unique=true)
     * @ORM\GeneratedValue(strategy="CUSTOM")
     * @ORM\CustomIdGenerator(class="Ramsey\Uuid\Doctrine\UuidGenerator")
     */
    private UuidInterface $uuid;

    /**
     * @var string
     *
     * @Expose
     * @Groups({"short"})
     * @ORM\Column(name="`label`", type="string", length=255, unique=true)
     */
    private string $label;

    /**
     * @var string
     *
     * @Expose
     * @Groups({"short"})
     * @ORM\Column(type="string", length=255, unique=true)
     */
    private string $label_normalized;

    /**
     * @var DateTime
     *
     * @Expose
     * @Groups({"short"})
     * @ORM\Column(type="datetime", length=255, nullable=false)
     */
    private DateTime $created;

    /**
     * @var DateTime
     *
     * @Expose
     * @Groups({"short"})
     * @ORM\Column(type="datetime", length=255, nullable=false)
     */
    private DateTime $updated;

    /**
     * @var Collection
     *
     * @Expose
     * @ORM\OneToMany(targetEntity="App\Domain\TrainingData\TrainingData", mappedBy="wake_word")
     */
    private Collection $training_data;

    /**
     * @return UuidInterface
     */
    public function getUuid(): UuidInterface
    {
        return $this->uuid;
    }

    /**
     * @param UuidInterface $uuid
     * @return WakeWord
     */
    public function setUuid(UuidInterface $uuid): WakeWord
    {
        $this->uuid = $uuid;
        return $this;
    }

    /**
     * @return string
     */
    public function getLabel(): string
    {
        return $this->label;
    }

    /**
     * @param string $label
     * @return WakeWord
     */
    public function setLabel(string $label): WakeWord
    {
        $this->label = $label;
        $this->setLabelNormalized($this->slugify($label));
        return $this;
    }

    private function slugify($string, $delimiter = '-'): string
    {
        $oldLocale = setlocale(LC_ALL, '0');
        setlocale(LC_ALL, 'en_US.UTF-8');
        $clean = iconv('UTF-8', 'ASCII//TRANSLIT', $string);
        $clean = preg_replace("/[^a-zA-Z0-9\/_|+ -]/", '', $clean);
        $clean = strtolower($clean);
        $clean = preg_replace("/[\/_|+ -]+/", $delimiter, $clean);
        $clean = trim($clean, $delimiter);
        setlocale(LC_ALL, $oldLocale);
        return $clean;
    }

    /**
     * @return string
     */
    public function getLabelNormalized(): string
    {
        return $this->label_normalized;
    }

    /**
     * @param string $label_normalized
     * @return WakeWord
     */
    public function setLabelNormalized(string $label_normalized): WakeWord
    {
        $this->label_normalized = $label_normalized;
        return $this;
    }

    /**
     * @return DateTime
     */
    public function getCreated(): DateTime
    {
        return $this->created;
    }

    /**
     * @param DateTime $created
     * @return WakeWord
     */
    public function setCreated(DateTime $created): WakeWord
    {
        $this->created = $created;
        return $this;
    }

    /**
     * @return DateTime
     */
    public function getUpdated(): DateTime
    {
        return $this->updated;
    }

    /**
     * @param DateTime $updated
     * @return WakeWord
     */
    public function setUpdated(DateTime $updated): WakeWord
    {
        $this->updated = $updated;
        return $this;
    }

    /**
     * @return Collection
     */
    public function getTrainingData(): Collection
    {
        return $this->training_data;
    }

    /**
     * @param Collection $training_data
     * @return WakeWord
     */
    public function setTrainingData(Collection $training_data): WakeWord
    {
        $this->training_data = $training_data;
        return $this;
    }

    /**
     * @ORM\PrePersist
     * @ORM\PreUpdate
     */
    public function updateUpdatedDateTime()
    {
        $dateTimeNow = new DateTime('now');

        $this->setUpdated($dateTimeNow);

        if (!isset($this->created)) {
            $this->setCreated($dateTimeNow);
        }
    }
}
