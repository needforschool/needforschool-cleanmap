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
    public function apiGetBen(ApiMapRepository $BenRepository): Response
    {
        $response = new Response();
    
        $httpClient = HttpClient::create();
        $reponseApi = $httpClient->request('GET', 'https://data.toulouse-metropole.fr/api/records/1.0/search/?dataset=points-dapport-volontaire-dechets-et-moyens-techniques&q=&facet=commune&facet=flux&facet=centre_ville&rows=6000&facet=prestataire&facet=zone&facet=pole');
        $content = json_decode($reponseApi->getContent(), true);
        $nbrBenCreated = 0;
        //Boucler sur le tableau et insérer toutes les régions
        
        foreach ($content["records"] as $BenData) {

            
               
                
                
                
                // var_dump($BenData["fields"]);
                if (!empty($BenData["fields"]["geo_point_2d"]) && !empty($BenData["fields"]["commune"]) && !empty($BenData["fields"]["adresse"]) && !empty($BenData["fields"]["flux"])&& $BenData["fields"]["flux"] == 'Récup\'verre') {
                    $nbrBenCreated++; 
                    $apiMap = new ApiMap();
                    $apiMap->setGeoPoint($BenData["fields"]["geo_point_2d"])
                ->setCommune($BenData["fields"]["commune"])
                ->setAdresse($BenData["fields"]["adresse"])
                ->setFlux($BenData["fields"]["flux"]);
                $this->entityManager->persist($apiMap);
                }
                
            
        }
        
        $this->entityManager->flush();
        $response->setStatusCode(Response::HTTP_OK);
        $response->setContent($nbrBenCreated . " regions added");
        
        return $response;
    }
}
