# tinu
Url Shortner Service

# usage
to dockerize run,

 docker-compose build
 docker-compose up

the image can be pulled directly from dockerhub
 docker pull chetansindhe/application

 kubectl create -f MongoSetup.yaml
 kompose up 


Mongo stateful setup is as per Mongo DB official documentation
https://www.mongodb.com/blog/post/running-mongodb-as-a-microservice-with-docker-and-kubernetes

Nodejs program to persist the shortened urls talks to the mongo cluster through a service.


# NodeJs Program to shorten Url (Code is commented out in source files)
There were 2 approaches w.r.t inserting records into mongo
 - Dont do a lookup of the incoming url (that needs to be shortened), just generate a hash using shortid (https://www.npmjs.com/browse/keyword/shortid)
   Pros:
     - no lookups while shortening the Url
     - Configure mongo replicasets with index. i.e write happens only on the mongo master(when shortining) and all the read requests later on to be served from replica sets
     - Better on Time complexity     
  Cons:
     - The shortid component for generating hashes should be realible and not trigger any hash collisions
     - Space complexity 
     - Not reliable when url shortner servive is deployed in cluster mode.
     
# 2nd Approach (This is the code that is checked-in and working)
 - Mongo generates ObjectIds and maintains uniqueness even in cluster mode. Use this ObjectId (https://docs.mongodb.com/manual/reference/method/ObjectId/) for url shortning.
  Pros:
    - Better on Space Complexity and Time complexity
    - _id field is already indexed by mongo. No additional indexing required.
    - Scales better.
  Cons
    - The ObjectId (ex: 5a3902658e0bf64829876e33) is 24 chars in length. This is bit too much for a url shortner! a TBD!
    
 
 # Refactoring code after discussion with Tommy
 - Worked on space and time complexities
 - Converted GET method to POST on url shortening request
 
 
  # TDB
  - since this whole program is setup on Win7 using Docker for Windows, there is an issue with Istio configuration when issuing external IP to loadbalancer.
  Injecting envoy containers into pods has an issue with minikube on windows
  kubectl create -f <your-app-spec>.yaml
  
  tried manual injection too, with
   
   kubectl create -f <(istioctl kube-inject -f <your-app-spec>.yaml)
  
  
  # Constraints
   - No mac or Linux machine was available
   - Setup Virtual box hosting Ubuntu, but minikube/kubernetes failed to start due to virtualization issues, though the host machine running Win7 has virtualization enabled.
   
  # References
   https://github.com/kubernetes/kubernetes/tree/master
   
   docker.com
   
   https://hub.docker.com/
   
   https://www.mongodb.com/
   
   https://medium.com/@sunnykay/docker-development-workflow-node-express-mongo-4bb3b1f7eb1e
   
   https://www.docker.com/
   
   https://istio.io/docs/welcome/
