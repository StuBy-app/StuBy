package org.example.stuby_back.util;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@ConfigurationProperties(prefix = "app")
@Data
public class AppProperties {
    private String serverHost;
    private Map<String, ImageConfig> imageConfigs = new HashMap<>();

    @Data
    public static class ImageConfig {
        private String prefix;
        private String dirPath;
        private String defaultImg;
    }

}