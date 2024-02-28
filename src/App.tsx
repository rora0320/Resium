import {
    Viewer,
    Entity,
    CameraFlyTo,
    CameraFlyHome,
    CameraLookAt,
    PointPrimitiveCollection,
    PointPrimitive, Camera, CorridorGraphics, CylinderGraphics, CesiumComponentRef, Model, Cesium3DTileset,
} from "resium";

import * as Cesium from "cesium";
import {
    Cartographic,
    CesiumTerrainProvider, ClockViewModel,
    createWorldTerrainAsync,
    Ellipsoid, InterpolationAlgorithm, sampleTerrain, sampleTerrainMostDetailed,
    TerrainProvider,
    Viewer as CesiumViewer
} from "cesium";
import { Matrix3, Matrix4, Transforms, Cartesian3, Color, CornerType } from "cesium";
import {useEffect, useRef, useState} from "react";
import interpolate = module

// 포인터 위치
const position = Cartesian3.fromDegrees(74.0707383, 40.7117244, 100);
const pointGraphics = { pixelSize: 10 };
//카메라를 지구본의 특정 위치로 고정
const lookAtPoint = {
    target:Cartesian3.fromDegrees(127.0707383, 35.7117244, 100),
    offset:new Cartesian3(-74.0707383,40.7117244,10000000)
}
//카메라 날아가서 위치 변경
const flyToPoint=Cartesian3.fromDegrees(127.38196357284114,36.32838543812952,1000);
// const center = Cartesian3.fromDegrees(125.59777, 40.03883);
//
// //model 위치 가져온것
// const origin = Cartesian3.fromDegrees(127.38196357284114, 36.32838543812952, 1);
// const rotationAngle = Cesium.Math.toRadians(-90);
// // y축 90도 회전된 프레임 생성
// const rotationMatrix = Matrix3.fromRotationX(rotationAngle); // Y축을 중심으로 90도 회전
// const fixedFrame = Transforms.eastNorthUpToFixedFrame(origin);
// const rotatedFixedFrame = Matrix4.multiplyByMatrix3(fixedFrame, rotationMatrix, new Matrix4());
//
// const cameraDest = Cartesian3.fromDegrees(125.0, 40.0, 1000);
// const modelMatrix = Transforms.eastNorthUpToFixedFrame(origin);
function App() {
    const [terrain, setTerrain] = useState<CesiumTerrainProvider | undefined>();
    const viewerRef=useRef<CesiumComponentRef<CesiumViewer>>(null);
    const [flyGetPosition,setFlyGetPosition]=useState(flyToPoint);
    const [entityModel,setEntityModel]=useState(<></>)

    useEffect(() => {

        if (!terrain) {
            createWorldTerrainAsync().then((terrain) => {
                setTerrain(terrain);
            });
        }

    }, []);

    useEffect(() => {

        if(viewerRef.current?.cesiumElement) {
            console.log('세슘 요소 있음.')
            glbTileSetInfo();

        }else{

            console.log('세슘 요소 없음.')
        }
        // glbTileSetInfo();
    }, [terrain]);


const glbTileSetInfo = async ()=>{
    const tileList = await (await fetch("/glbTest.json")).json();
    const coordsList = await (await fetch('/rectCoords.jsonl')).text();

    const lines = coordsList.split("\n");
    const newLines = lines
        .map((line) => {
            if (line) {
                return JSON.parse(line); // 각 줄을 JSON으로 파싱
            }
        })
        .filter(Boolean); // 빈 줄 제거
    const jsonObjects = await Promise.all(newLines);

    // console.log('tileList',tileList)
    // console.log('jsonObjects',jsonObjects)
    // const TileSet = await Cesium.createOsmBuildingsAsync();
    // viewerRef.current.cesiumElement.scene.primitives.add(TileSet);
    const list=[];
    const test = jsonObjects.map((jsonObj,index)=>{
        const tiles =tileList.root.contents.filter((tile)=> tile.uri===jsonObj.filePath)
        if(tiles.length>0){
            // 여기부터 고도 구하기
            const positions = [
                Cartographic.fromDegrees(jsonObj.middleCenter[0], jsonObj.middleCenter[1])
            ];
            // # 테레인 고도 구하기
            let sampleLong=0;
            let sampleHeight = 0;
            let samplelatitude=0;

            if (terrain) {
                // console.log('terrain',terrain)
                // // 디그리 jsonObj.bottomLeft[0]
                //
                // const cartographicPosition = Cesium.Cartographic.fromDegrees(jsonObj.bottomLeft[0], jsonObj.bottomLeft[1]);
                // console.log('cartographicPosition',cartographicPosition)
                // const 테레인하이 = viewerRef.current?.cesiumElement.scene.globe.getHeight(cartographicPosition);
                // // console.log('테레인하이',테레인하이)


                sampleTerrain(terrain, 11, positions).then((updatedPositions) => {
                    const [{ height,latitude,longitude }] = updatedPositions;
                    sampleLong=longitude
                    samplelatitude=latitude;
                    sampleHeight = height;
                    //
                    // console.log('위도:', Cesium.Math.toDegrees(latitude));   // 디그리로 변환한 위도 값
                    // console.log('경도:', Cesium.Math.toDegrees(longitude));  // 디그리로 변환한 경도 값
                    console.log(
                        `${sampleLong}, ${samplelatitude} 위치의 고도는 ${sampleHeight}m 입니다.`
                    );
                });

            }

            //model 위치 가져온것
            const origin = Cartesian3.fromDegrees(jsonObj.bottomLeft[0], jsonObj.bottomLeft[1], jsonObj.z[0]+25);

            const fixedFrame = Transforms.eastNorthUpToFixedFrame(origin);
            const rotationAngle = Cesium.Math.toRadians(-90);
            // Y축을 중심으로 90도 회전
            const rotationMatriY = Matrix3.fromRotationY(rotationAngle);
            //x축 90도 회전된 프레임 생성
            const rotationMatriX = Matrix3.fromRotationX(rotationAngle);

            const rotatedFixedFrameY = Matrix4.multiplyByMatrix3(fixedFrame, rotationMatriY, new Matrix4());
            const rotatedFixedFrameX = Matrix4.multiplyByMatrix3(rotatedFixedFrameY, rotationMatriX, new Matrix4());

            list.push(<Model key={`model_${index}`} url={jsonObj.filePath} modelMatrix={rotatedFixedFrameX} />)
            setEntityModel(list)
            return jsonObj
        }
    }).filter(Boolean)
    console.log('test',test)
}

    const getPosition=(e)=>{

        const viewer = viewerRef.current.cesiumElement;
        const pickPoint = viewer.scene.pick(e.position)

        const pickPointValue = pickPoint.id.position._value;
        const flyPositionCartographic = Ellipsoid.WGS84.cartesianToCartographic(pickPointValue);

        //경도(세로)
        const longitude = Cesium.Math.toDegrees(flyPositionCartographic.longitude);
        //위도(가로)
        const latitude = Cesium.Math.toDegrees(flyPositionCartographic.latitude);
        const height = flyPositionCartographic.height;

        const flyPositionCartesian3 = Cartesian3.fromDegrees(longitude, latitude, 400);

        if (pickPoint && pickPoint.id && pickPoint.id.position) {

            viewer.camera.flyTo({
                destination: flyPositionCartesian3,
                duration: 2.0,
            });

        } else {
            console.error('Unable to determine valid flyPosition');
        }

        // const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
        //
        // handler.setInputAction((click) => {
        //     console.log('movement',click)
        //     const pickedPosition=viewer.scene.pickPosition(e.position)
        //     console.log('pickedPosition',pickedPosition)
        // }, ScreenSpaceEventType.LEFT_CLICK);
        // if(viewer) {
        //     const pickedPosition=viewer.scene.pickPosition(e.position)
        //     console.log('???',pickedPosition)
        //     pickedPosition.z = 3696375;
        //     console.log('new pickedPosition',pickedPosition)
        //     // viewer.camera.flyTo({
        //     //     destination: pickedPosition,
        //     //     duration: 2.0,
        //     // });
        //
        // }
    }

    return (
        <>
        {!terrain ? (
        null
    ) : (
        <Viewer full ref={viewerRef} terrainProvider={terrain} >


            {/*/!*<CameraLookAt {...lookAtPoint}/>*!/*/}
            {/*/!*<Camera />*!/*/}
            {/*<CameraFlyTo destination={flyGetPosition}/>*/}
            {/*/!*<Scene/>*!/*/}
            {/*<Entity name='Corridor' position={Cartesian3.fromDegrees(128.0, 40.0,100)} onClick={getPosition}>*/}
            {/*    <CorridorGraphics*/}
            {/*        material={Color.BLUE}*/}
            {/*        positions={Cartesian3.fromDegreesArray([128.0, 40.0, 131.0, 40.0, 131.0, 35.0]) as any} // WORKAROUND*/}
            {/*        height={200000.0}*/}
            {/*        extrudedHeight={100000.0}*/}
            {/*        width={200000.0}*/}
            {/*        cornerType={CornerType.BEVELED}*/}
            {/*        outline // height or extrudedHeight must be set for outlines to display*/}
            {/*        outlineColor={Color.BLUE}*/}
            {/*    />*/}
            {/*</Entity>*/}
            {/*<Entity name='pointer' position={Cartesian3.fromDegrees(127.0707383,35.7117244,100)} point={{ pixelSize: 10 ,color:Color.YELLOW}} onClick={getPosition}>*/}
            {/*</Entity>*/}
            {/*<Entity name='Cylinder' position={Cartesian3.fromDegrees(127.0707383, 50.7117244, 100)} onClick={getPosition}>*/}
            {/*    <CylinderGraphics*/}
            {/*        length={400000.0}*/}
            {/*        topRadius={200000.0}*/}
            {/*        bottomRadius={200000.0}*/}
            {/*        material={Color.GREEN.withAlpha(0.5)}*/}
            {/*        outline*/}
            {/*        outlineColor={Color.DARKGREEN}*/}
            {/*    />*/}
            {/*</Entity>*/}

                {/*<Model url={"Tile_+000_+002.obj_deoffset.glb"} modelMatrix={rotatedFixedFrame}*/}
                {/*       // minimumPixelSize={128}*/}
                {/*       maximumScale={50}*/}
                {/*       scale={5.0}*/}
                {/*>*/}
                {/*</Model>*/}
                {/*<Model url={"Tile_+000_+003.obj_deoffset.glb"} modelMatrix={rotatedFixedFrame}*/}
                {/*       // minimumPixelSize={128}*/}
                {/*       maximumScale={50}*/}
                {/*       scale={5.0}*/}
                {/*>*/}
                {/*</Model>*/}
                {/*<Model url={"Tile_+001_+001.obj_deoffset.glb"} modelMatrix={rotatedFixedFrame}*/}
                {/*       // minimumPixelSize={128}*/}
                {/*       maximumScale={50}*/}
                {/*       scale={5.0}*/}
                {/*>*/}
                {/*</Model>*/}
                {/*<Model url={"Tile_+001_+002.obj_deoffset.glb"} modelMatrix={rotatedFixedFrame}*/}
                {/*       // minimumPixelSize={128}*/}
                {/*       maximumScale={50}*/}
                {/*       scale={5.0}*/}
                {/*>*/}
                {/*</Model>*/}
            <CameraFlyTo destination={flyGetPosition}/>

            {/*<Cesium3DTileset*/}
            {/*    url={"glbTest.json"}*/}
            {/*    // modelMatrix={rotatedFixedFrame1}*/}
            {/*    // modelMatrix={Cesium.Transforms.eastNorthUpToFixedFrame(*/}
            {/*    //     Cesium.Cartesian3.fromDegrees(75.152325, 39.94704, 0.0))}*/}
            {/*    onReady={tileset => {*/}
            {/*        console.log('tileset',tileset)*/}
            {/*      viewerRef.current?.cesiumElement?.zoomTo(tileset);*/}
            {/*    }}*/}
            {/*/>*/}
            {entityModel}
            {/*<PointPrimitiveCollection modelMatrix={Transforms.eastNorthUpToFixedFrame(center)}>*/}
            {/*    <PointPrimitive color={Color.ORANGE} position={new Cartesian3(58.0,58.0,0.0)}  onClick={(e)=>getPosition(e)}/>*/}
            {/*    <PointPrimitive color={Color.YELLOW} position={new Cartesian3(100000.0, -200000.0, 0.0)}/>*/}
            {/*</PointPrimitiveCollection>*/}
            {/*<CameraFlyTo destination={flyGetPosition} duration={2.0}/>*/}
        </Viewer>
        )}
        </>
    );
}

export default App;
