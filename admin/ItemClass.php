<?php

class Item {
	public $title;
	public $client;
	public $link;
	public $brief_description;
	public $description;
	public $thumb;
	public $images;

	public function build() {
		$index = new Array(
			"title" => $this->title,
			"description" => $this->brief_description,
			"thumb" => $this->thumb
		);

		$dataItem = new Array(
			"title" => $this->title,
			"client" => $this->client,
			"link" => $this->client,
			"description" => $this->description,
			"client" => $this->client,
			"images" => $this->uploadImages($this->images)
		);
	}

	private function uploadImages($imgArray) {

	}
}

?>