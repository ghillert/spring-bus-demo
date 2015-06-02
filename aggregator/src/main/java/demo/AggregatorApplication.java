package demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.actuate.endpoint.MetricReaderPublicMetrics;
import org.springframework.boot.actuate.endpoint.PublicMetrics;
import org.springframework.boot.actuate.metrics.aggregate.AggregateMetricReader;
import org.springframework.boot.actuate.metrics.export.MetricExportProperties;
import org.springframework.boot.actuate.metrics.reader.MetricReader;
import org.springframework.boot.actuate.metrics.repository.redis.RedisMetricRepository;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.data.redis.connection.RedisConnectionFactory;

@SpringBootApplication
@EnableDiscoveryClient
public class AggregatorApplication {

	@Autowired
	private MetricExportProperties export;

	@Autowired
	private RedisConnectionFactory connectionFactory;

	@Bean
	public PublicMetrics metricsAggregate() {
		return new MetricReaderPublicMetrics(aggregatesMetricReader());
	}

	private MetricReader globalMetricsForAggregation() {
		return new RedisMetricRepository(this.connectionFactory,
				this.export.getRedis().getAggregatePrefix(), this.export.getRedis().getKey());
	}

	private MetricReader aggregatesMetricReader() {
		AggregateMetricReader repository = new AggregateMetricReader(
				globalMetricsForAggregation());
		return repository;
	}

	public static void main(String[] args) {
		SpringApplication.run(AggregatorApplication.class, args);
	}
}
