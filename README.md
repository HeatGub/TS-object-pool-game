# Object pool asteroid game - TypeScript
This code is mainly the one you can find under source links (with minor changes), but rewritten from JavaScript to TypeScript. Made for coding practise and enjoyment.

# Overwiew
- Object oriented code with **object pool** optimization which **eliminates JS garbage collection**.
- Click an asteroid to gain a point. Collect 10 point to save the universe and admire the magnificent winning text.

- Run a server for dist/index.html to play.

# Object pools
- Object pools (asteroidPool and explosionPool) are lists of objects of given length. These pools are being initialized in the Game class constructor. Instead of being created and deleted, objects are just turned back to the initial state. Therefore garbage collection wont have a reason to happen, which is an advantage, especially in calculation-heavy moments.
  
- *Pool's length have to be carefully chosen. You can only have as many instances as pool length. If the pool length is too long, memory is needlessly used.*

<p align="center">
  <img src="https://github.com/HeatGub/TS-flow-fields/assets/115884941/3d832021-ee6f-472c-8163-b58e56e38d7d" width=60% height=60%>
</p>

# Sources
- https://www.youtube.com/watch?v=NYzvdfkDOU4&ab_channel=Frankslaboratory
- https://www.youtube.com/watch?v=Pm8srmWUCY0&ab_channel=Frankslaboratory

# Thanks
to [Frank's laboratory](https://www.youtube.com/@Frankslaboratory) for sharing the knowledge