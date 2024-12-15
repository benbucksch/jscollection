# Run from app/ directory
[ ! -e release.sh ] && echo "Please run from root directory" 1>&2 && exit 1
[ ! -z "`git status --porcelain`" ] && echo "Source tree not clean" 1>&2 && exit 1
VERSION=$1
echo Building version $VERSION
[ -z $VERSION ] && echo "Please provide the new version number" 1>&2 && exit 1

perl -p -i \
  -e "s|\"version\": \".*\"|\"version\": \"$VERSION\"|;" \
  package.json
git commit package.json -m "Version $VERSION"
git tag -s "v$VERSION" -m $VERSION

npm publish

NEXTVERSION=`node -e "let v = process.argv[1].split('.'); let last = parseInt(v.pop()) + 1; console.log(v.join('.') + '.' + last);" $VERSION`-dev
perl -p -i \
  -e "s|\"version\": \".*\"|\"version\": \"$NEXTVERSION\"|;" \
  package.json
git commit package.json -m "Starting version $NEXTVERSION"

git push
git push --tags
