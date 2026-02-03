from flask import Flask, request, redirect, render_template_string
import sqlite3
import os

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# صفحة Admin
@app.route('/admin')
def admin():
    return render_template_string(open('admin.html').read())

# رفع اللعبة
@app.route('/upload', methods=['POST'])
def upload():
    name = request.form['name']
    description = request.form['description']
    category = request.form['category']

    icon_file = request.files['icon']
    game_file = request.files['apk']

    icon_path = os.path.join(UPLOAD_FOLDER, icon_file.filename)
    game_path = os.path.join(UPLOAD_FOLDER, game_file.filename)

    icon_file.save(icon_path)
    game_file.save(game_path)

    # حفظ البيانات في قاعدة SQLite
    conn = sqlite3.connect('games.db')
    c = conn.cursor()
    c.execute('INSERT INTO games (name, description, icon, file, category) VALUES (?, ?, ?, ?, ?)',
              (name, description, icon_path, game_path, category))
    conn.commit()
    conn.close()

    return redirect('/admin')

# عرض الألعاب للمستخدم
@app.route('/')
def index():
    conn = sqlite3.connect('games.db')
    c = conn.cursor()
    c.execute('SELECT name, description, icon, file FROM games')
    games = c.fetchall()
    conn.close()

    html = "<h1>ألعابنا</h1>"
    for game in games:
        html += f'''
        <div>
            <img src="{game[2]}" width="100"><br>
            <b>{game[0]}</b><br>
            <p>{game[1]}</p>
            <a href="{game[3]}" download>تحميل اللعبة</a>
            <hr>
        </div>
        '''
    return html

if __name__ == '__main__':
    app.run(debug=True)
