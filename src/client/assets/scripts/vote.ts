$(() => {
  /**
   * Returns a random integer in [0, top)
   * @param top The upper limit (excluded)
   */
  function randInt(top: number): number {
    return Math.floor(Math.random() * top);
  }

  /**
   * Shuffles an array in-place using the Durstenfield shuffle
   * @param array The array to be shuffle
   */
  function shuffleArray<T>(array: { [key: number]: T, length: number }): void {
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = randInt(i + 1);
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

  /**
   * Pushes `undefined` into array until it is of size length
   * @param array The array to extend to length
   * @param size The size to extend
   */
  function extendArray<T>(array: T[], size: number): void {
    while (array.length < size) {
      array.push(undefined);
    }
  }

  function full<T>(array: T[]): boolean {
    return array.every((value) => value !== undefined);
  }

  /******************************
   * Set up locking and unlocking
   ******************************/
  const keys = "abcdefghjiklmnopqrstuvwxyz";
  const keyCode = $("#key-code");
  const lockDiv = $("#lock");

  let unlockKey = "";
  let locked = true;

  /**
   * Sets a random letter from the English alphabet
   * to unlock the screen
   */
  function randomKey(): string {
    return keys[randInt(keys.length)];
  }

  function lock(): void {
    unlockKey = randomKey();
    keyCode.text(unlockKey);
    if (!locked) {
      locked = true;
      lockDiv.css("top", "0");
    }
  }

  function unlock(): void {
    locked = false;
    lockDiv.css("top", "-100%");
  }

  $(document).keydown((keydown) => {
    if (locked && keydown.key === unlockKey) {
      unlock();
    }
  });

  /*****************************
   * Activate candidate on click
   *****************************/
  const candidateBlocks = $(".candidates-block");
  const active = "candidate-active";
  const inactive = "candidate-inactive";
  const cardSelector = ".candidate-card";

  candidateBlocks.each((_BLOCK_INDEX, block) => {
    const blockElem = $(block);

    blockElem.find(cardSelector).each((_CARD_INDEX, card) => {
      const cardElem = $(card);

      cardElem.click(() => {
        if (!locked) {
          cardElem.removeClass(inactive);
          cardElem.addClass(active);

          blockElem.find(cardSelector).each(
            (_INACTIVE_INDEX, inactiveCard) => {
              const currentCard = $(inactiveCard);

              if (!cardElem.is(currentCard)) {
                currentCard.removeClass(active);
                currentCard.addClass(inactive);
              }
            }
          );
        }
      });
    });
  });

  /*****************************
   * Set up shuffling candidates
   *****************************/
  /**
   * Shuffles all the candidates in each poll
   */
  function shuffleAllPolls(): void {
    candidateBlocks.each((_BLOCK_INDEX, block) => {
      const blockElem = $(block);
      const cards = blockElem.find(cardSelector);

      cards.detach();
      shuffleArray(cards);
      blockElem.append(cards);
    });
  }

  /*************************************
   * Set up recording and checking votes
   *************************************/
  const votes: string[] = [];
  const numPolls = Number($("body").attr("data-poll-number"));
  extendArray(votes, numPolls);

  // Add one slide for list of selected candidates
  const numSlides = numPolls + 1;

  const submitButton = $("#submit-button");
  const fillAll = $("#fill-all");
  candidateBlocks.each((index, block) => {
    const blockElem = $(block);

    blockElem.find(cardSelector).each((_INDEX, card) => {
      const cardElem = $(card);

      cardElem.click(() => {
        if (!locked) {
          votes[index] = cardElem.attr("data-candidate-id");

          $(`#selected-candidate-${index}`)
            .text(cardElem.attr("data-candidate-name"));

          if (full(votes)) {
            submitButton.css("display", "inline-block");
            fillAll.css("display", "none");
          }
        }
      });
    });
  });

  const leftArrow = $("#left-arrow");
  const rightArrow = $("#right-arrow");

  let leftHidden = true;
  let rightHidden = false;

  function hideLeft(): void {
    if (!leftHidden) {
      leftArrow.css("display", "none");
      leftHidden = true;
    }
  }

  function hideRight(): void {
    if (!rightHidden) {
      rightArrow.css("display", "none");
      rightHidden = true;
    }
  }

  function showLeft(): void {
    if (leftHidden) {
      leftArrow.css("display", "flex");
      leftHidden = false;
    }
  }

  function showRight(): void {
    if (rightHidden) {
      rightArrow.css("display", "flex");
      rightHidden = false;
    }
  }

  const carousel = $("#vote-carousel") as JQuery<HTMLElement> & {
    carousel(arg: string | number): void;
  };

  carousel.on(
    "slide.bs.carousel",
    (e: JQuery.Event<HTMLElement, null> & { to: number }) => {
      if (e.to === 0) {
        hideLeft();
        showRight();
      } else if (e.to === numSlides - 1) {
        showLeft();
        hideRight();
      } else {
        showLeft();
        showRight();
      }
    }
  );

  const allCards = $(cardSelector);
  const selectedCandidateTds = $("[id^=\"selected-candidate-\"");

  function reset(): void {
    submitButton.css("display", "none");
    fillAll.css("display", "block");
    window.setTimeout(() => {
      carousel.removeClass("slide");
      carousel.carousel(0);
      carousel.addClass("slide");
    }, 400);

    allCards.removeClass(active);
    allCards.removeClass(inactive);

    while (votes.length > 0) {
      votes.pop();
    }

    extendArray(votes, numPolls);

    for (let i = 0; i < numPolls; ++i) {
      selectedCandidateTds.text("No candidate chosen.");
    }

    lock();
    shuffleAllPolls();
  }

  const notification = $("#notification");
  function hideNotification(): void {
    notification.fadeOut();
  }
  function showNotification(): void {
    notification.fadeIn();
    window.setTimeout(hideNotification, 2400);
  }

  submitButton.click(() => {
    $.ajax({
      url: "/vote",
      method: "POST",
      data: { votes },
      success: () => {
        showNotification();
        reset();
      },
      error: (res) => {
        alert(res.responseText);
      }
    });
  });

  reset();
});
