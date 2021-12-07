<?php

namespace App\Entity;

use App\Repository\ApiMapRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ApiMapRepository::class)
 */
class ApiMap
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $commune;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $adresse;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $flux;

    /**
     * @ORM\Column(type="array")
     */
    private $geo_point = [];

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCommune(): ?string
    {
        return $this->commune;
    }

    public function setCommune(string $commune): self
    {
        $this->commune = $commune;

        return $this;
    }

    public function getAdresse(): ?string
    {
        return $this->adresse;
    }

    public function setAdresse(string $adresse): self
    {
        $this->adresse = $adresse;

        return $this;
    }

    public function getFlux(): ?string
    {
        return $this->flux;
    }

    public function setFlux(string $flux): self
    {
        $this->flux = $flux;

        return $this;
    }

    public function getGeoPoint(): ?array
    {
        return $this->geo_point;
    }

    public function setGeoPoint(array $geo_point): self
    {
        $this->geo_point = $geo_point;

        return $this;
    }
}
