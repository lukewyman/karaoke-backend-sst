import pytest
import uuid
from karaoke.rotations.rotation import Rotation

@pytest.fixture 
def fixture_singers():
    return [
        None,
        {
            'singer_id': 'd9791b8e-00bd-451d-8226-4bc11883c88e',
            'song_id': '5f0bdd34-8516-4978-bfd3-9fa19a7ce819',
            'song_title': 'title-1',
            'song_artist': 'artist-1'
        },
        {
            'singer_id': '6cf219fa-c458-4906-8426-5f6ef74baf0d',
            'song_id': 'fa04aeb3-f2e3-44df-8a01-15d54e974ef4',
            'song_title': 'title-2',
            'song_artist': 'artist-2'
        },
        {
            'singer_id': 'de73d467-8699-45a9-8794-c573911ebabd',
            'song_id': '1b23e435-f411-40cb-8104-b8347a10dc45',
            'song_title': 'title-3',
            'song_artist': 'artist-3'
        },
        {
            'singer_id': 'bf30e6cd-a5e3-47ff-8972-115753bbeb93',
            'song_id': '7c38e69b-4852-48cf-8517-9903d6a528b7',
            'song_title': 'title-4',
            'song_artist': 'artist-4'
        },
    ]


def test_can_create_an_empty_rotation():
    rotation_id = uuid.uuid4()
    rotation = Rotation(rotation_id)
    
    assert rotation.rotation_id == rotation_id
    assert len(rotation.singers) == 0
    assert rotation.current_singer == None


def test_can_add_a_singer_to_a_rotation(fixture_singers):
    rotation = Rotation(uuid.uuid4())

    rotation.add_singer(fixture_singers[1])

    assert len(rotation.singers) == 1
    assert rotation.current_singer == fixture_singers[1]


def test_can_add_multiple_singers_to_a_rotation(fixture_singers):
    rotation = Rotation(uuid.uuid4())

    rotation.add_singer(fixture_singers[1])
    rotation.add_singer(fixture_singers[2])
    rotation.add_singer(fixture_singers[3])

    assert len(rotation.singers) == 3
    assert rotation.current_singer == fixture_singers[1]


def test_cannot_add_singer_already_in_rotation(fixture_singers):
    rotation = Rotation(uuid.uuid4())
    rotation.add_singer(fixture_singers[1])
    rotation.add_singer(fixture_singers[2])
    rotation.add_singer(fixture_singers[3])

    with pytest.raises(ValueError):
        rotation.add_singer(fixture_singers[2])


def test_completing_performance_advances_rotation_to_next_singer(fixture_singers):
    rotation = Rotation(uuid.uuid4())
    rotation.add_singer(fixture_singers[1])
    rotation.add_singer(fixture_singers[2])
    rotation.add_singer(fixture_singers[3])

    rotation.complete_performance()

    assert len(rotation.singers) == 3
    assert rotation.current_singer == fixture_singers[2]


def test_completing_performance_twice_advances_rotation_2_singers(fixture_singers):
    rotation = Rotation(uuid.uuid4())
    rotation.add_singer(fixture_singers[1])
    rotation.add_singer(fixture_singers[2])
    rotation.add_singer(fixture_singers[3])

    rotation.complete_performance()
    rotation.complete_performance()

    assert len(rotation.singers) == 3
    assert rotation.current_singer == fixture_singers[3]


def test_completing_performance_for_last_singer_returns_to_beginning_of_rotation(fixture_singers):
    rotation = Rotation(uuid.uuid4())
    rotation.add_singer(fixture_singers[1])
    rotation.add_singer(fixture_singers[2])
    rotation.add_singer(fixture_singers[3])
    # advance to last singer
    rotation.complete_performance()
    rotation.complete_performance()

    # advance back to first singer
    rotation.complete_performance()

    assert len(rotation.singers) == 3
    assert rotation.current_singer == fixture_singers[1]


def test_rotation_in_correct_state_after_removing_singer_after_current(fixture_singers):
    rotation = Rotation(uuid.uuid4())
    rotation.add_singer(fixture_singers[1])
    rotation.add_singer(fixture_singers[2])
    rotation.add_singer(fixture_singers[3])
    rotation.add_singer(fixture_singers[4])
    # advance to second singer
    rotation.complete_performance()

    rotation.remove_singer(fixture_singers[3])

    assert len(rotation.singers) == 3
    assert rotation.current_singer == fixture_singers[2]
    assert rotation.singers[0] == fixture_singers[1]
    assert rotation.singers[1] == fixture_singers[2]
    assert rotation.singers[2] == fixture_singers[4]


def test_rotation_in_correct_state_after_removing_singer_before_current(fixture_singers):
    rotation = Rotation(uuid.uuid4())
    rotation.add_singer(fixture_singers[1])
    rotation.add_singer(fixture_singers[2])
    rotation.add_singer(fixture_singers[3])
    rotation.add_singer(fixture_singers[4])
    # advance to third singer
    rotation.complete_performance()
    rotation.complete_performance()

    rotation.remove_singer(fixture_singers[2])

    assert len(rotation.singers) == 3
    assert rotation.current_singer == fixture_singers[3]
    assert rotation.singers[0] == fixture_singers[1]
    assert rotation.singers[1] == fixture_singers[3]
    assert rotation.singers[2] == fixture_singers[4]


def test_rotation_in_correct_state_after_removing_current_singer(fixture_singers):
    rotation = Rotation(uuid.uuid4())
    rotation.add_singer(fixture_singers[1])
    rotation.add_singer(fixture_singers[2])
    rotation.add_singer(fixture_singers[3])
    rotation.add_singer(fixture_singers[4])
    # advance to second singer
    rotation.complete_performance()

    rotation.remove_singer(fixture_singers[2])

    assert len(rotation.singers) == 3
    assert rotation.current_singer == fixture_singers[3]
    assert rotation.singers[0] == fixture_singers[1]
    assert rotation.singers[1] == fixture_singers[3]
    assert rotation.singers[2] == fixture_singers[4]


def test_rotation_in_correct_state_after_removing_current_and_last_singer(fixture_singers):
    rotation = Rotation(uuid.uuid4())
    rotation.add_singer(fixture_singers[1])
    rotation.add_singer(fixture_singers[2])
    rotation.add_singer(fixture_singers[3])
    rotation.add_singer(fixture_singers[4])
    # advance to last singer
    rotation.complete_performance()
    rotation.complete_performance()
    rotation.complete_performance()

    rotation.remove_singer(fixture_singers[4])

    assert len(rotation.singers) == 3
    assert rotation.current_singer == fixture_singers[1]
    assert rotation.singers[0] == fixture_singers[1]
    assert rotation.singers[1] == fixture_singers[2]
    assert rotation.singers[2] == fixture_singers[3]


def test_cannot_remove_singer_that_is_not_in_rotation(fixture_singers):
    rotation = Rotation(uuid.uuid4())
    rotation.add_singer(fixture_singers[1])
    rotation.add_singer(fixture_singers[2])

    with pytest.raises(ValueError):
        rotation.remove_singer(fixture_singers[3])
