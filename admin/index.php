<?php require 'ItemClass.php'; 



?>
<html>
<head>
	<title>Admin panel</title>
	<link href="../style.css" rel="stylesheet" />
</head>
<body>
<div class="container admin">
	<header>
		<div class="logo"><a href="#" onclick="fn.getItems()"></a></div>
		<h1><a href="/">Adrian Cooney</a></h1>
		<h3>An Irish Designer and Developer</h3>
		<nav>
			<ul>
				<li><a href="/" target="_blank">Open Homepage</a></li>
		</nav>
	</header>
	<form>
		<h4>Title</h4>
		<input type="text" name="title" />
		<div class="left">
			<h4>Client</h4>
			<input type="text" name="client" />
		</div>
		<div class="right">
			<h4>ID</h4>
			<input type="number" name="id" />
		</div>
		<h4>Link</h4>
		<input type="text" name="link" />
		<h4>Brief Description</h4>
		<input type="text" name="link" />
		<h4>Description</h4>
		<textarea name="description"></textarea>
		<h4>Thumb <span>(300 x 150)</span></h4>
		<input type="file" name="thumb" />
		<h4>Images</h4>
		<input type="file" name="image-1" />
		<input type="file" name="image-2" />
		<input type="file" name="image-3" />
		<br><input type="submit" />
	</form>
</body>
</html>