import Carousel from "react-bootstrap/Carousel";
import ThersaAudio from "../assets/Theresa.mp3";
import AdamAudio from "../assets/adam.mp3";
import WilsonAudio from "../assets/wilson.m4a";

function CarouselComp({ playAudio }) {
  return (
    <Carousel>
      <Carousel.Item>
        <img
          src="https://raikes.unl.edu/sites/unl.edu.raikes-school/files/styles/1_1_960x960/public/node/person/photo/2024-07/people-headshot-adam-britten.jpg?itok=fAYbnhXs"
          className="d-block w-100"
          alt="adam"
          onClick={() => playAudio(AdamAudio)}
        />
        <Carousel.Caption>
          <h3>Director of Student Success</h3>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          src="https://raikes.unl.edu/sites/unl.edu.raikes-school/files/styles/1_1_960x960/public/node/person/photo/2024-07/people-headshot-becky-barnard.jpg?itok=d8fal0xg"
          className="d-block w-100"
          alt="Bekey"
        />
        <Carousel.Caption>
          <h3>Events & Projects Coordinator</h3>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          src="https://raikes.unl.edu/sites/unl.edu.raikes-school/files/styles/1_1_960x960/public/node/person/photo/2024-07/people-headshot-theresa-luensmann.jpg?itok=unLlsXcF"
          className="d-block w-100"
          alt="theresa"
          onClick={() => playAudio(ThersaAudio)}
        />
        <Carousel.Caption>
          <h3 className="">Director of Outreach </h3>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          src="https://media.licdn.com/dms/image/v2/D5603AQHSXRUVk33t0A/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1726530605597?e=1752105600&v=beta&t=Gl5KfaDnVkxlDObX_AZL2kzfxDqhlpdoc0S8H6eLl5s"
          alt="wilson"
          onClick={() => playAudio(WilsonAudio)}
        />
        <Carousel.Caption>
          <h3>Student Volunteer</h3>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}
export default CarouselComp;
