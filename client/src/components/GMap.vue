<template>
  <div
    id="map"
    ref="googleMap"
    class="google-map"
  />
</template>

<script>
import GoogleMapsApiLoader from 'google-maps-api-loader'

export default {
  props: {
    center: {
      type: Object,
      default: () => ({ lat: 25.0325917, lng: 121.5624999 })
    },
    zoom: {
      type: Number,
      default: 14
    },
    streetViewControl: {
      type: Boolean,
      default: true
    },
    mapTypeControl: {
      type: Boolean,
      default: true
    },
    fullscreenControl: {
      type: Boolean,
      default: true
    },
    zoomControl: {
      type: Boolean,
      default: true
    },
    locations: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      map: null,
      infowindow: null,
      markers: [],
      google: null,
      apiKey: process.env.VUE_APP_GOOGLE
    }
  },
  watch: {
    center (val) {
      this.resetCenter()
      this.setMarker()
    }
  },
  async mounted () {
    // Initialize Google Maps API
    const googleMapApi = await GoogleMapsApiLoader({
      apiKey: this.apiKey
    })
    // Save the instance created
    this.google = googleMapApi
    // Create a map
    this.initMap()
    this.setMarker()
  },
  methods: {
    initMap () {
      const mapContainer = this.$refs.googleMap
      this.map = new this.google.maps.Map(mapContainer, {
        center: this.center,
        zoom: this.zoom,
        maxZoom: 20,
        minZoom: 3,
        streetViewControl: this.streetViewControl,
        mapTypeControl: this.mapTypeControl,
        fullscreenControl: this.fullscreenControl,
        zoomControl: this.zoomControl
      })
    },
    resetCenter () {
      // set center
      this.map.panTo({ lat: this.center.lat, lng: this.center.lng })
    },
    clearMarkers () {
      this.markers.forEach(marker => marker.setMap(null))
      this.markers = []
    },
    setMarker () {
      // clear existing markers
      this.clearMarkers()

      this.locations.forEach(location => {
        const marker = new this.google.maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          map: this.map
        })

        // save markers
        this.markers.push(marker)

        // Create info window for each marker
        const infowindow = new this.google.maps.InfoWindow({
          content: `
          <div id="content">
            <p id="firstHeading" class="firstHeading">${location.name}</p>
          </div>
        `,
          maxWidth: 200
        })

        // Open the info window for the marker being clicked
        marker.addListener('click', () => {
          if (this.infowindow) this.infowindow.close()
          infowindow.open(this.map, marker)
          this.infowindow = infowindow
        })
      })
    }
  }
}
</script>
