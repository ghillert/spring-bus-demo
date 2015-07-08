Spring Bus Voter Application
============================

# Requirements

* Java 8
* Maven

Some familiarity with Spring Cloud and the underlying Netflix OSS stack is recommended:

http://cloud.spring.io/spring-cloud-netflix/spring-cloud-netflix.html

# Building the App

	$ mvn clean package

# Running the App

	$ SERVER_PORT=8090 java -jar voter/target/voter-1.0.0.BUILD-SNAPSHOT.jar

	$ SERVER_PORT=8091 java -jar counter/target/counter-1.0.0.BUILD-SNAPSHOT.jar

	$ SERVER_PORT=8092 java -jar graphs/target/graphs-0.0.1-SNAPSHOT.jar

	$ java -jar aggregator/target/aggregator-0.0.1-SNAPSHOT.jar

Web interfaces/Rest end are available at:

* http://localhost:8090/
* http://localhost:8091/elections
* http://localhost:8092/

http://localhost:8761/eureka/

