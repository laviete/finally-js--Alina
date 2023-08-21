"use strict";
const root = document.getElementById("root");
const chosenList = document.getElementById("choose");
const socials = new Map();
socials.set("www.facebook.com", "./assetes/icons/facebook.svg");
socials.set("twitter.com", "./assetes/icons/twitter.svg");
socials.set("www.instagram.com", "./assetes/icons/instagram.svg");

fetch("./assetes/js/data.json")
  .then((response) => response.json())
  .then((actors) => {
    const actorItems = actors
      .filter((actor) => actor.firstName.trim() && actor.lastName.trim())
      .map((actor) => createActorCard(actor));
    root.append(...actorItems);
  })
  .catch((error) => {
    const errorMsg = createElement(
      "p",
      { classNames: ["error-message"] },
      "Oops...Try later"
    );
    root.append(errorMsg);
  });

function createActorCard({ firstName, lastName, profilePicture, contacts }) {
  const links = contacts.map((contact) => {
    const hostname = new URL(contact).hostname;
    const img = createElement("img", {
      attributes: { src: socials.get(hostname)},
    });
    return createElement("a", {attributes: {href: contact}}, img);
  });
  const h3 = createElement(
    "h3",
    { classNames: ["actor-name"] },
    firstName + " " + lastName
  );
  const h3Initials = createElement(
    "h3",
    {
      classNames: ["actor-initials"],
      styles: { backgroundColor: stringToColour(h3.textContent) },
    },
    document.createTextNode(getActorInitials(h3.textContent))
  );
  const divPhotoWrapper = createElement(
    "div",
    { classNames: ["actor-photo-wrapper"] },
    h3Initials
  );
  const divSocialNetworks = createElement(
    "div",
    { classNames: ["social-networks"] },
    ...links
  );
  const photo = createElement("img", {
    classNames: ["actor-photo"],
    attributes: { src: profilePicture, alt: firstName + " " + lastName },
    events: { load: handleImgLoad(divPhotoWrapper) },
  });
  const article = createElement(
    "article",
    { classNames: ["actor-card"] },
    divPhotoWrapper,
    h3,
    divSocialNetworks
  );
  const liItem = createElement(
    "li",
    {
      classNames: ["actor-item"],
      events: {
        click: () => {
          if (
            !Array.from(chosenList.children).some(
              (child) => child.textContent === firstName + " " + lastName
            )
          ) {
            const chosenActor = createElement("li", {
              classNames: ["choose-li"],
            });
            chosenActor.textContent = firstName + " " + lastName;
            chosenList.append(chosenActor);
          }
        },
      },
    },
    article
  );
  return liItem;
}
