package cz.telemetry.whiskey.resource;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Demo")
@RestController
@RequestMapping("/demo")
public record DemoResource() {

  @GetMapping("/yolo")
  public ResponseEntity<String> demo() {
    return ResponseEntity.ok("Yolo!");
  }
}
