<?php

class ControllerApiTest extends Controller
{
  public function test() {
    $this->load->model('api/test');
    echo $this->model_api_test->getData();
  }
}