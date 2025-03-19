package cz.telemetry.whiskey.exception;

import java.net.URI;
import org.springframework.http.HttpStatus;
import org.zalando.problem.AbstractThrowableProblem;
import org.zalando.problem.spring.common.HttpStatusAdapter;

public class WhiskeyException extends AbstractThrowableProblem {

  protected WhiskeyException(String title, HttpStatus status, Object detail, String code) {
    super(URI.create("someUrl" + code), title, new HttpStatusAdapter(status),
        detail == null ? "" : detail.toString());
  }
}
