<?php

namespace App\Controller;

use App\Entity\ApiMap;
use App\Repository\ApiMapRepository;
use Doctrine\ORM\Cache\Region;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\VarDumper\VarDumper;

class ApiController extends AbstractController
{

    #[Serializer]
    private $serializer;

    public function __construct(EntityManagerInterface $em)
    {
        $encoder = new JsonEncoder();
        $defaultContext = [
            AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function ($object, $format, $context) {
                return $object->getNom();
            },
        ];
        $normalizer = new ObjectNormalizer(null, null, null, null, null, null, $defaultContext);
        $this->serializer = new Serializer([$normalizer], [$encoder]);
        $this->entityManager = $em;
    }
    // 
    #[Route('/api', name: 'api',  methods: ['GET'])]
    public function api(): Response
    {
        $data = [
            'data' => null,
            'message' => 'Start coding your api in Controller/ApiController'
        ];
        $content = $this->serializer->serialize($data, 'json', ['json_encode_options' => JSON_UNESCAPED_SLASHES]);

        $response = new Response();
        $response->setContent($content);
        $response->setStatusCode(Response::HTTP_OK);
        $response->headers->set('Content-Type', 'application/json');
        return $response;
    }
    #[Route('/api2', name: 'api_test',  methods: ['GET'])]
    public function apiGetBen(EntityManagerInterface $manager, ApiMapRepository $BenRepository): Response
    {
        $response = new Response();
    
        $httpClient = HttpClient::create();
        $reponseApi = $httpClient->request('GET', 'https://data.toulouse-metropole.fr/api/records/1.0/search/?dataset=points-dapport-volontaire-dechets-et-moyens-techniques&q=&facet=commune&facet=flux&facet=centre_ville&rows=6000&facet=prestataire&facet=zone&facet=pole');
        $content = json_decode($reponseApi->getContent(), true);
        $nbrBenCreated = 0;
        
        foreach ($content["records"] as $BenData) {
            $existingBen = $BenRepository->findOneBy([
                'code_barre' => $BenData["recordid"],
            ]);
        
            if (empty($existingBen) || is_null($existingBen)) {
                $ApiMap = new ApiMap();
                $ApiMap->setCodeBarre($BenData["recordid"]);
                if (empty($BenData["fields"]["adresse"]) || $BenData["fields"]["adresse"] == '') {
                    $BenData["fields"]["adresse"] = 'Adresse inconnue';
                }
                if (empty($BenData["fields"]["commune"]) || $BenData["fields"]["commune"] == '') {
                    $BenData["fields"]["commune"] = 'Commune inconnu';
                }
                if (empty($BenData["fields"]["flux"]) || $BenData["fields"]["flux"] == '') {
                    $BenData["fields"]["flux"] = 'Flux inconnu';
                }
                if ($BenData["fields"]["flux"] == 'Récup\'verre') {
                    $ApiMap->setFlux($BenData["fields"]["flux"]);
                    $ApiMap->setCommune($BenData["fields"]["commune"]);
                    $ApiMap->setAdresse($BenData["fields"]["adresse"]); 
                    $ApiMap->setLatitude($BenData["fields"]["geo_point_2d"][0]);
                    $ApiMap->setLongitude($BenData["fields"]["geo_point_2d"][1]);
                    $nbrBenCreated++;
                    $manager->persist($ApiMap);
                }
                
            } else {
                $apiRecordsID = array_column($content, 'recordid');
                if (!in_array($existingBen->getCodeBarre(), $apiRecordsID)) {
                    $manager->remove($existingBen);
                } else {
                    if ($existingBen->getLatitude() != $BenData["fields"]["geo_point_2d"][0]) {
                        $existingBen->setLatitude($BenData["fields"]["geo_point_2d"][0]);
                    }
                    if ($existingBen->getLongitude() != $BenData["fields"]["geo_point_2d"][1]) {
                        $existingBen->setLongitude($$BenData["fields"]["geo_point_2d"][1]);
                    }
                }
            }
        }
        
        $manager->flush();
        
        $this->entityManager->flush();
        $response->setStatusCode(Response::HTTP_OK);
        $response->setContent($nbrBenCreated . " regions added");
        
        return $response;
    }
    
}