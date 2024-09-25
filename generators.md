# NestJS

## Generate service
```
nx g @nx/nest:service auth --directory=apps/backend/src/app/auth
```

## Generate module
```
nx g @nx/nest:module auth --directory=apps/backend/src/app/auth
```


## Generate controller
```
nx g @nx/nest:controller auth --directory=apps/backend/src/app/auth
```


# Angular

## Generate Page
```
nx g @nx/angular:component my-page --directory=apps/frontend/src/app/pages/my-page
```

## Generate Component
```
nx g @nx/angular:component my-component --directory=apps/frontend/src/app/components/my-component
```

## Generate Directive
```
nx g @nx/angular:directive my-directive --directory=apps/frontend/src/app/directives/my-directive
```

## Generate Pipe
```
nx g @nx/angular:pipe my-pipe --directory=apps/frontend/src/app/pipes/my-pipe
```

## Generate Service
```
nx g @nx/angular:service my-service --directory=apps/frontend/src/app/services/my-service
```



# Lib

```
npx nx g @nx/js:library interfaces --directory=libs/interfaces --bundler=none --unitTestRunner=jest --projectNameAndRootFormat=as-provided
```
