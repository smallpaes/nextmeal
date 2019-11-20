<template>
  <div
    class="star-wrapper form-check-inline"
  >
    <input
      id="star5"
      class="star-input"
      type="radio"
      name="rating"
      value="5"
      required
      @input="$emit('input', $event.target.value)"
    >
    <label
      class="star-label"
      for="star5"
    />
    <input
      id="star4"

      class="star-input"
      type="radio"
      name="rating"
      value="4"
      @input="$emit('input', $event.target.value)"
    >
    <label
      class="star-label"
      for="star4"
    />
    <input
      id="star3"

      class="star-input"
      type="radio"
      name="rating"
      value="3"
      @input="$emit('input', $event.target.value)"
    >
    <label
      class="star-label"
      for="star3"
    />
    <input
      id="star2"

      class="star-input"
      type="radio"
      name="rating"
      value="2"
      @input="$emit('input', $event.target.value)"
    >
    <label
      class="star-label"
      for="star2"
    />
    <input
      id="star1"

      class="star-input"
      type="radio"
      name="rating"
      value="1"
      @input="$emit('input', $event.target.value)"
    >
    <label
      class="star-label"
      for="star1"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.star {
  &-wrapper {
    position: relative;
    transform: rotateY(180deg);
  }

  &-input {
    display: none;
    &:checked ~ label:after { opacity: 1; }
  }

  &-label {
    position: relative;
    display: block;
    width: 25px;
    height: 25px;
    margin-right: .4rem;
    cursor: pointer;

    &::before {
      position: relative;
      display: block;
      font-family: "Font Awesome 5 Free";
      font-size: size(md);
      font-weight: weight(bold);
      color: lighten(color(secondary), 50%);
      content: '\f005';
    }

    &::after {
      position: absolute;
      top: 0;
      display: block;
      font-family: "Font Awesome 5 Free";
      font-size: size(md);
      font-weight: weight(bold);
      color: color(primary);
      content: '\f005';
      opacity: 0;
      transition: .3s
    }

    &:hover {
      &::after { opacity: 1; }
      & ~ label::after { opacity: 1; }
    }
  }
}
</style>
