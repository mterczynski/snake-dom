# 2. Copy build to ../mterczynski.github.io
rm -rf ../mterczynski.github.io/snake/
cp -r ./img ../mterczynski.github.io/snake/
cp ./index.html ../mterczynski.github.io/snake/
cp ./main.js ../mterczynski.github.io/snake/
cd ../mterczynski.github.io
# 3. Commit in ../mterczynski.github.io
git add .
git commit -m "Update snake build: $(git log -1 --pretty=format:"%s")"
git status
# 4. Push in ../mterczynski.github.io
git push
