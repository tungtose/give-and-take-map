resource "aws_vpc" "tungtodev" {
  cidr_block           = "10.0.0.0/24"
  enable_dns_hostnames = true
  tags = {
    Name = "tungtodev"
  }
}

resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.tungtodev.id
}

resource "aws_route_table" "route_table_1" {
  vpc_id = aws_vpc.tungtodev.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }

  tags = {
    Name = "rt_1"
  }
}

resource "aws_route_table" "route_table_2" {
  vpc_id = aws_vpc.tungtodev.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }

  tags = {
    Name = "rt_2"
  }
}

resource "aws_subnet" "subnet_1" {
  vpc_id            = aws_vpc.tungtodev.id
  cidr_block        = "10.0.0.0/26" # 62
  availability_zone = "ap-southeast-1b"

  tags = {
    Name = "public_subnet_1"
  }
}

resource "aws_subnet" "subnet_2" {
  vpc_id            = aws_vpc.tungtodev.id
  cidr_block        = "10.0.0.64/26"
  availability_zone = "ap-southeast-1c"

  tags = {
    Name = "public_subnet_2"
  }
}

resource "aws_route_table_association" "b" {
  subnet_id      = aws_subnet.subnet_1.id
  route_table_id = aws_route_table.route_table_1.id
}

resource "aws_route_table_association" "c" {
  subnet_id      = aws_subnet.subnet_2.id
  route_table_id = aws_route_table.route_table_2.id
}

resource "aws_security_group" "allow_web" {
  name        = "allow_web_traffic"
  description = "Allow Web inbound traffic"
  vpc_id      = aws_vpc.tungtodev.id

  ingress {
    description = "api"
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "webhook"
    from_port   = 8088
    to_port     = 8088
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "mongo"
    from_port   = 27017
    to_port     = 27017
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "allow_web"
  }
}

resource "aws_network_interface" "web_server_ic_1" {
  subnet_id       = aws_subnet.subnet_1.id
  private_ips     = ["10.0.0.5"]
  security_groups = [aws_security_group.allow_web.id]
}

resource "aws_network_interface" "web_server_ic_2" {
  subnet_id       = aws_subnet.subnet_1.id
  private_ips     = ["10.0.0.6"]
  security_groups = [aws_security_group.allow_web.id]
}

resource "aws_network_interface" "web_server_qa" {
  subnet_id       = aws_subnet.subnet_1.id
  private_ips     = ["10.0.0.7"]
  security_groups = [aws_security_group.allow_web.id]
}

resource "aws_eip" "eip_1" {
  vpc                       = true
  network_interface         = aws_network_interface.web_server_ic_1.id
  associate_with_private_ip = "10.0.0.5"
  depends_on                = [aws_internet_gateway.gw]
}
