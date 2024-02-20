import {Viewer, Entity, PointGraphics, GeoJsonDataSource, KmlDataSource, Scene, Globe, Camera} from "resium";
import { Cartesian3 } from "cesium";

// 포인터 위치
const position = Cartesian3.fromDegrees(74.0707383, 40.7117244, 100);
const data = {
    type: "Feature",
    properties: {
        name: "Coors Field",
        amenity: "Baseball Stadium",
        popupContent: "This is where the Rockies play!",
    },
    geometry: {
        type: "Point",
        coordinates: [-104.99404, 39.75621],
    },
};

function App() {
    return (
        <Viewer full>
            <Scene>
                <Globe>
                    <Camera>
                        <Entity position={position} name="Tokyo" description="Hello, world.">
                            <PointGraphics pixelSize={10} />
                        </Entity>
                    </Camera>
                </Globe>
            </Scene>
            {/*<GeoJsonDataSource data={"your_geo_json.geojson"} />*/}
            {/*<KmlDataSource data={"your_geo_json.kml"} />*/}
            {/*<GeoJsonDataSource data={data} />*/}
        </Viewer>
    );
}

export default App;